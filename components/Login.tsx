import { useRouter } from 'next/router';
import React, { FormEvent, FunctionComponent, useRef, useContext, useState } from 'react'
import useHttp from '../hooks/use-http';
import { LoginContext } from '../store/LoginContext';
import { User } from '../types/DbModels';

const Login = () => {
  const {login} = useContext(LoginContext);
  const router = useRouter();
  const {sendRequest, isLoading, error} = useHttp();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const [message, setMesssage] = useState('');

  const submitHandler = async (e:FormEvent) => {
    e.preventDefault();

    const response = await sendRequest('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: emailRef.current!.value, password:passRef.current!.value})
    });

    if(!response) return;
    setMesssage(response.message)

    if(response.status == 'success'){
      setTimeout(()=> {router.replace('/');login(response)}, 1000)
    }
    
  }

  return <div>
    <h1>Loign</h1>
    <form onSubmit={submitHandler}>
      <input type="phone" placeholder="Enter email or phone" ref={emailRef}/>
      <input type="password" placeholder="Enter password" ref={passRef} />
      <input type="submit" value="Login" />
    </form>
    {isLoading && <p>...loading</p>}
    {!isLoading && error && <p>{error}</p>}
    {!isLoading && message && <p>{message}</p>}
  </div> 
}
export default Login;