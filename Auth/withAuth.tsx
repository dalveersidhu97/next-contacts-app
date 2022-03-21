import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiResponse,
} from "next";
import { isLoggedIn } from "../lib/isLoggedin";
import { signAndAddTokenToCookies } from "../lib/tokenlib";
import { User } from "../types/DbModels";
import LoginUser from "../types/LoginUser";

const PROTECTED_ROUTES_EXAT = ['/'];
const PROTECTED_ROUTES = ['/dashboard']
const ONLY_NON_LOGIN_ROUTES = ['/login', '/signup']

type GetSrvProps = (gspcx: GetServerSidePropsContext, user: LoginUser)=>Promise<GetServerSidePropsResult<any>>;

const withAuth = (gsps:GetSrvProps) => {

  return async (context: GetServerSidePropsContext) => {
    const req = context.req;
    const res = context.res;
    let loggedIn = false;

    const user = await isLoggedIn(req.cookies.accessToken);
    let loginUser: LoginUser = undefined;
    if(user){
      loggedIn = true;
      loginUser = {name: user.name, phone: user.phone, image: user.image || null, email: user.email, _id: user._id}
      signAndAddTokenToCookies(res as NextApiResponse, user);
    }

    // identify route type
    const url = new URL('http://'+req.headers.host+req.url!);

    const redirect = {redirect: {
      permanent: false,
      destination: "/login"
    }}


    if(!loggedIn){
      for (const route of PROTECTED_ROUTES_EXAT) {
        if(url.pathname==route)
          return redirect;
      }

      for (const route of PROTECTED_ROUTES){
        if(url.pathname.includes(route))
          return redirect;
      }
    }

    if(loggedIn){
      for (const route of ONLY_NON_LOGIN_ROUTES){
        if(url.pathname.includes(route))
          return {redirect: {permanent: false, destination: '/'}};
      }
    }
    const gtr = await gsps(context, loginUser);
    return gtr;
  };
}

export default withAuth;
