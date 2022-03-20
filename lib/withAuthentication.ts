import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../types/DbModels";
import {isLoggedIn} from './isLoggedin';
import { signAndAddTokenToCookies } from "./tokenlib";

export default function withAuthentication(handler: (rq: NextApiRequest, rs: NextApiResponse, user: User)=>Promise<void>){

    return async (req: NextApiRequest, res: NextApiResponse) => {

        const user = await isLoggedIn(req.cookies.accessToken);
        
        if(!user) return res.status(400).json({status: 'failed', message: 'Your are not loggedin!'});
        signAndAddTokenToCookies(res, user); // update token
        
        return await (async (req: NextApiRequest,res: NextApiResponse) => {

            return await handler(req, res, user);

        })(req, res)
    }

}