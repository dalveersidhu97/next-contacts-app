import { useRouter } from 'next/router';
import { FormEvent, FunctionComponent, useRef, useState } from 'react'
import useHttp from '../hooks/use-http';

const Signup: FunctionComponent = () => {

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  
  const [message, setMessage] = useState('');
  const router = useRouter();

  const {sendRequest, isLoading, error} = useHttp();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const response = await sendRequest('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: nameRef.current!.value, phone: phoneRef.current?.value, email: emailRef.current?.value, password: passRef.current?.value})
    });

    if(!response) return;
    setMessage(response.message)

    if(response.status == 'success'){
      setTimeout(()=>{
        router.replace('/login');
      }, 1000);
    }

  }

  return <div>
    <h1>Signup</h1>
    <form onSubmit={submitHandler}>
      <input type="text" placeholder="Enter name" ref={nameRef}/>
      <input type="email" placeholder="Enter email" ref={emailRef}/>
      <input type="phone" placeholder="Enter phone number" ref={phoneRef}/>
      <input type="password" placeholder="Enter password" ref={passRef} />
      <input type="submit" value="Signup" />
    </form>
    
    {!isLoading && error && <p>{error}</p>}
    {!isLoading && message && <p>{message}</p>}
    {isLoading && <p>...Loading</p>}
  </div> 
}
export default Signup;