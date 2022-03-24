import { createContext, FunctionComponent, useCallback, useEffect, useState } from 'react';
import useHttp from '../hooks/use-http';
import Cookie from 'js-cookie';
import {useRouter} from 'next/router';
import { UserSerializable } from '../types/DbModels';

type User = UserSerializable;

type Login = {
    user?: User,
    login: (email: string, password: string) => Promise<string | false>,
    logout: () => void,
    referesh: () => void,
    isLoading:boolean,
    error: string | undefined
}

const LOGIN_URL = '/api/login';
const VERIFY_LOGIN_URL = '/api/verify';

export const LoginContext = createContext<Login>({
    login: async (email: string, pass: string) => false, 
    logout: () => {},
    user: undefined,
    isLoading: false,
    referesh: () => {},
    error: undefined
});

const LoginProvider: FunctionComponent<{loginUser: User}> =  function LoginProvider(props) {
  const [user, setUser] = useState<User | undefined>(props.loginUser);
  const {sendRequest, isLoading, error} = useHttp();
  const Router = useRouter();

  const logout = useCallback(async () => {
    await sendRequest('/api/logout', {method:'POST'});
    Cookie.remove('name');
    Cookie.remove('image');
    Cookie.remove('accessToken');
    setUser(undefined);
  }, [sendRequest]);


  const login = useCallback(async (email: string, password: string) => {
    
    const response = await sendRequest('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    });

    if(error) return error;

    if(!response) return false;

    if(response && response.status == 'success') {
      const user: User = {name: response.data.name, phone: response.data.phone, image: response.data.image, email: response.data.email, _id: response.data._id}
      setTimeout(()=> {Router.replace('/');setUser(user);}, 1000)
    }

    const message = response.message as string
    return message;
  }, [Router, error, sendRequest]);

  const referesh = async () => {
    const response = await sendRequest('/api/verify', {});

    if(error || !response) return logout();

    if(response.status == 'success') {
      const user: User = {name: response.data.name, phone: response.data.phone, image: response.data.image, email: response.data.email, _id: response.data._id}
      setUser(user);
    }
  }

  const context: Login = {
      user,
      login,
      logout,
      isLoading,
      error,
      referesh
  }

  const isLoggedIn = props.loginUser ? true: false;

  useEffect(()=>{
    if(!isLoggedIn) {
      logout();
    }
  }, [isLoggedIn, logout]);

  return (
    <LoginContext.Provider value={context}>
      {props.children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
