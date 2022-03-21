import { createContext, Dispatch, FunctionComponent, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import useHttp from '../hooks/use-http';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

type User = {
  name: string,
  image: string, 
  email: string,
  phone: string
  _id: string
}

type Login = {
    isLoggedIn: undefined | 'LOGGEDIN' | 'NOT_LOGGEDIN',
    user?: User,
    login: (response:any) => void,
    logout: () => void,
    isLoading:boolean,
    verify: ()=>void
}

const LOGIN_URL = '/api/login';
const VERIFY_LOGIN_URL = '/api/verify';

export const LoginContext = createContext<Login>({
    isLoggedIn: undefined,
    login: (response:any) => {}, 
    logout: () => {},
    user: undefined,
    isLoading: false,
    verify: ()=>{}
});

const LoginProvider: FunctionComponent =  function LoginProvider(props) {
  const [loggedIn, setLoggedIn] = useState<undefined | 'LOGGEDIN' | 'NOT_LOGGEDIN'>(undefined);
  const [user, setUser] = useState<User>();
  const router = useRouter();
  const {sendRequest, isLoading} = useHttp();

  const logout = useCallback(async () => {
    await sendRequest('/api/logout', {method:'POST'});
    Cookie.remove('name');
    Cookie.remove('image');
    Cookie.remove('accessToken');
    setLoggedIn('NOT_LOGGEDIN');
    setUser(undefined);
    router.replace('/login');
  }, [sendRequest]);


  const processLogin = useCallback((response: any) => {
    if(response && response.status == 'success') {
      const user: User = {name: response.data.name, phone: response.data.phone, image: response.data.image, email: response.data.email, _id: response.data._id}
      setLoggedIn('LOGGEDIN');
      setUser(user);
    }else {
      logout();
    }
  }, [logout]);

  const login = async (response: any) => {
      processLogin(response);
  }

  const verify = useCallback(async () => {
    console.log('Verify')
    const response = await sendRequest(VERIFY_LOGIN_URL, {});
    processLogin(response);
  }, [processLogin, sendRequest]);

  const context: Login = {
      isLoggedIn: loggedIn,
      user,
      login,
      logout,
      isLoading,
      verify
  }

  
  useEffect(()=> {
    if(!loggedIn){
      verify();
    }
    console.log('useEffet')
  }, [loggedIn, sendRequest, processLogin, verify]);

  return (
    <LoginContext.Provider value={context}>
      {props.children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
