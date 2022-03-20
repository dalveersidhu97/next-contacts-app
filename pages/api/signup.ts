import { hash } from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { userCollection } from "../../db/collections";
import { insertDocument } from "../../db/utils";
import { anyEmpty } from "../../lib/inputValidation";
import {User} from '../../types/DbModels';

export default async function registerUser(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method != "POST") return;

  let response = {status: 'failed', message: '', data: {}}

  // input

  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  console.log(req.body);

  // input validation
  if(anyEmpty(name, email, password)){
    response.message = 'All fields are required!';
    return res.status(200).json(response);
  }

  const newUser: User = {
    name,email,password
  };

  // encrypt passwords
  newUser.password = await hash(newUser.password.trim(), 12);

  // process
  const insertedUser = await insertDocument(newUser, await userCollection(), (err:any)=> {
    if (err.code && err.code === 11000) {
      response.message = "Email already exists!";
    } else {
      console.log(err);
      response.message = "Something went wrong, Please try again!";
    }
  });

  // If Success
  if(insertedUser){
    response.status = 'success';
    response.message = "Registration successful!";
    response.data = {id: insertedUser.insertedId};
  }

  // Response
  res.status(200).json(response);
}
