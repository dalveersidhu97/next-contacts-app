import type { NextApiRequest, NextApiResponse } from "next";
import { userCollection } from "../../db/collections";
import { User } from "../../types/DbModels";
import { signAndAddTokenToCookies, signToken } from "../../lib/tokenlib";
import {compare } from "bcrypt";
import { anyEmpty } from "../../lib/inputValidation";


export default async function login(req: NextApiRequest, res: NextApiResponse) {
  let response = {
    status: "failed",
    message: "Incorrect username or password",
    data: {},
  };

  if(req.method !== 'POST')
    return
  
  // Getting Input
  const email:string = req.body.email;
  const password:string = req.body.password;

  // Input validation
  if(anyEmpty(email, password))
    return res.status(200).json(response)

  // Find user
  const user = await (await userCollection()).findOne<User>({ email });

  // Password validation
  if (user==null || !await compare(password, user.password))
    return res.status(200).json(response); // Return Validation Failed

  // Generate token and set secure cookie
  signAndAddTokenToCookies(res, user, 60*60);

  // Prepare response
  response.data = { email: user.email, image: user.image, name: user.name, id: user._id?.toString() };
  response.status = "success";
  response.message = "Login success!";

  // Final Response
  res.status(200).json(response);
}

