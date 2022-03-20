import type { NextApiRequest, NextApiResponse } from "next";
import { userCollection } from "../../db/collections";

import { removeTokenCookie, signAndAddTokenToCookies, verifyToken } from "../../lib/tokenlib";
import { User } from "../../types/DbModels";



export default async function verify(req: NextApiRequest, res: NextApiResponse) {
    
    // Check if token exists in the cookies
    const token = req.cookies.accessToken;
    if(!token)
        return res.json({status: 'failed', message: 'Not logged In'});

    // Verify Token
    const decoded = verifyToken(token) as User;

    if (decoded == undefined){
        removeTokenCookie(res);
        return res.json({message: 'Invalid token!'});
    }

    // Check if the User still exits for this token
    const user = await (await userCollection()).findOne<User>({ 'email': decoded.email });
    if(user) {
        //signAndAddTokenToCookies(res, user); // update token
        return res.status(200).json({status: 'success', message: 'Login verified', data: {id: user._id, name: user.name, email: user.email, image: user.image}});
    }

    res.json({status: 'failed', message: 'Not logged In'});

}