import { NextApiRequest, NextApiResponse } from "next";
import { contactCollection, userCollection } from "../../db/collections";
import withAuthentication from "../../lib/withAuthentication";
import { Contact, User } from "../../types/DbModels";

export const FetchContacts = async (req: NextApiRequest, res: NextApiResponse, user: User) => {

    // get contacts form logged in user
    
    const contacts = await (await contactCollection()).find({userId: user._id}).toArray() as Contact[]

    return res.json({status: 'success', data: {contacts}});

}

export default withAuthentication(FetchContacts);