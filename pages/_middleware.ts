import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {

  //console.log(req.cookies)

    //   // Check if token exists in the cookies
    //   const token = req.headers.cookie;

    //   // Verify Token
    //   const decoded = verifyToken('token') as User;
  
    //   if (decoded == undefined) return {redirect}
  
    //   // Check if the User still exits for this token
    //   const user = await (await userCollection()).findOne<User>({ email: decoded.email });
  
    //   if (user) 
    //       return await gsps(context);
  
    //   return {redirect}

}