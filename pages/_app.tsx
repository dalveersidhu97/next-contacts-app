import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import LoginProvider from '../store/LoginContext'
import Router from 'next/router';
import LoginUser from '../types/LoginUser';
import axios from 'axios';
import {  BaseContext } from 'next/dist/shared/lib/utils';
import { UserSerializable } from '../types/DbModels';

function MyApp({ Component, pageProps, loginUser }: AppProps & {loginUser: UserSerializable}) {
  
  const props = {...pageProps, loginUser}
  console.log('MyApp', props)

  return <LoginProvider loginUser={loginUser}> <Layout><Component {...props} /></Layout></LoginProvider>
}

MyApp.getInitialProps = async (appContext: BaseContext) => {
  console.log('MyApp.getInitialProps');
  const {req, res, pathname} = appContext.ctx;

  let loginUser: LoginUser = undefined;

  const redirect = () => {
    console.log('Redirect Function >>>>>>')
    if(pathname != '/login' && pathname!='/signup'){
      if(!req){
        console.log('Client Side Rdirect >>>>')
        Router.push('/login')
        return {}
      }
      console.log('Server Side Rdirect >>>>')
      res.writeHead(302, {Location: '/login'})
      res.end();
      return {}
    }
  }

  let response;

  // server side code
  if(req) {
    if(!req.cookies.accessToken){
      redirect();
      return {}
    }
    response = await axios.get('http://localhost:3000/api/verify', {headers: {Authorization: req.cookies.accessToken}});
  }else {
    //client side request
    response = await axios.get('http://localhost:3000/api/verify');
  }
  
  // Both cilent and server side code
  if(!response || !response.data || !response.data){
    redirect();
    return {};
  }

  // logout if verification failed
  if(response.data?.status ==='failed'){
    await axios.get('http://localhost:3000/api/logout')
    redirect();
    return {};
  }

  const user = response.data.data;
  loginUser = {name: user.name, phone: user.phone, image: user.image || null, email: user.email, _id: user._id?.toString()}

  if(appContext.Component.getInitialProps){
      const pageProps = await appContext.Component.getInitialProps(appContext.ctx);
      return {...pageProps, loginUser}
  }

  return {loginUser};

}

export default MyApp
