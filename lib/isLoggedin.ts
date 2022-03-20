import { userCollection } from "../db/collections";
import { User } from "../types/DbModels";
import { verifyToken } from "./tokenlib";

export const isLoggedIn = async (token: string) => {
        
        const decoded = verifyToken(token) as User;

        if (!decoded) return false;

        const user = await (await userCollection()).findOne<User>({ email: decoded.email });
    
        if (!user) return false;

        return user;
        
}