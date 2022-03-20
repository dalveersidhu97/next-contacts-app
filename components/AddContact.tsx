import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import useHttp from "../hooks/use-http";

const AddCotact = () => {


    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    
    const [message, setMessage] = useState('');
    const router = useRouter();
  
    const {sendRequest, isLoading, error} = useHttp();

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const response = await sendRequest('/api/add-contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nameRef.current!.value, email: emailRef.current?.value, phone: phoneRef.current?.value})
          });
          console.log(response);
          if(!response) return;
          setMessage(response.message)
      
          if(response.status == 'success'){
            setTimeout(()=>{
              router.replace('/');
            }, 1000);
          }
    }


    return <div>
        <h1>Add a new contact</h1>
        <form onSubmit={submitHandler}>
        <input type="text" placeholder="Enter name" ref={nameRef}/>
        <input type="text" placeholder="Enter phone number" ref={phoneRef} />
        <input type="email" placeholder="Enter email" ref={emailRef}/>
        <input type="submit" value="Add contact" />
        </form>
        
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && message && <p>{message}</p>}
        {isLoading && <p>...Loading</p>}
    </div>
}

export default AddCotact;
