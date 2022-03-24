import { useRouter } from 'next/router';
import React, { FormEvent, useRef, useContext, useState } from 'react'
import { LoginContext } from '../store/LoginContext';

const Login = () => {
  const {login, isLoading, error} = useContext(LoginContext);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const [message, setMesssage] = useState('');

  const submitHandler = async (e:FormEvent) => {
    e.preventDefault();

    const loginResponse = await login(emailRef.current!.value, passRef.current!.value)

    setMesssage(loginResponse || '')
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