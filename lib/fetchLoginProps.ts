import { isLoggedIn } from "./isLoggedin";

export default async function getProps(req: any) {
    const user = await isLoggedIn(req.cookies.accessToken || '');
    if(user) {
      return {
        user
      }
    }
  }