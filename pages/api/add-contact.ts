import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../types/DbModels";

import { anyEmpty } from "../../lib/inputValidation";
import { insertDocument } from "../../db/utils";
import { contactCollection } from "../../db/collections";
import withAuthentication from "../../lib/withAuthentication";

const addContact = async (req: NextApiRequest,res: NextApiResponse, user: User) =>{

    if(req.method != "POST")
        return res.status(200).json({status: 'failed', message: 'Not secure!'});

    const {name, phone, email} = req.body;
    let response = { status: "failed", message: "", data: {} };

    const newContact = {
      name,
      phone,
      email,
      userId: user._id,
    };

    if (anyEmpty(newContact.name, newContact.phone, newContact.email))
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Please fill in the required fileds.",
        });

    const insertedContact = await insertDocument(
      newContact,
      await contactCollection(),
      (err) => {
        if (err.code && err.code === 11000) {
          response.message = "This contact already exists in your contacts list!";
          return res.status(400).json(response);
        } else {
          console.log(err);
          response.message = "Something went wrong, Please try again!";
        }
        return res.status(500).json(response);
      }
    );

    response.status = "success";
    response.message = "Contact added successfuly!";
    response.data = { id: insertedContact?.insertedId.toString() };

    return res.status(200).json(response);


};

export default withAuthentication(addContact);
