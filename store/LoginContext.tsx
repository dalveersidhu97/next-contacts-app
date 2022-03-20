import { createContext, Dispatch, FunctionComponent, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import useHttp from '../hooks/use-http';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

type User = {
  name: string, 
  image: string
} | undefined

type Login = {
    isLoggedIn: boolean,
    user: User,
    login: (response:any) => void,
    logout: () => void,
    isLoading:boolean,
    verify: ()=>void
}

const LOGIN_URL = '/api/login';
const VERIFY_LOGIN_URL = '/api/verify';

export const LoginContext = createContext<Login>({
    isLoggedIn: false,
    login: (response:any) => {}, 
    logout: () => {},
    user: undefined,
    isLoading: false,
    verify: ()=>{}
});

const LoginProvider: FunctionComponent =  function LoginProvider(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, image: string}>();
  const router = useRouter();
  const {sendRequest, isLoading} = useHttp();

  const logout = useCallback(async () => {
    await sendRequest('/api/logout', {method:'POST'});
    Cookie.remove('name');
    Cookie.remove('image');
    setUser(undefined);
    router.replace('/login');
  }, [sendRequest]);


  const processLogin = useCallback((response: any) => {
    if(response && response.status == 'success') {
      console.log(response)
      Cookie.set('name', response.data.name, { expires: 7, path: '/' });
      Cookie.set('image', response.data.image, { expires: 7, path: '/' });
      setUser(response.data);
      setLoggedIn(true)
    }else {
      logout();
    }
  }, [logout]);

  const login = async (response: any) => {
      processLogin(response);
  }

  const verify = async () => {
    const response = await sendRequest(VERIFY_LOGIN_URL, {});
    processLogin(response);
  }

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
  }, [loggedIn, sendRequest, processLogin]);

  return (
    <LoginContext.Provider value={context}>
      {props.children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
