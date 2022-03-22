import { NextPage } from "next";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import io, { Socket } from 'socket.io-client';

type Message = {msg: string, mine: boolean}

const ChatPage: NextPage = ()=>{

    const [messages, setMessages] = useState<Message[]>([]);
    const [typing, setTyping] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    const messageBoxRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket>();

    const submitHandler = (e: FormEvent)=>{
        e.preventDefault();

        if(!inputRef.current || !inputRef.current.value) return

        socketRef.current?.emit('not-typing');
        socketRef.current?.emit('message', inputRef.current.value);
        setMessages((prev: Message[])=> [...prev, {msg: inputRef.current!.value, mine: true}])
        setMessageInput('');
    }

    const inputChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
        if(e.target.value!='')
            socketRef.current?.emit('typing');
        else 
            socketRef.current?.emit('not-typing')
    }

    useEffect(()=>{
        if(messageBoxRef.current){
            messageBoxRef.current.scrollTop =  messageBoxRef.current?.scrollHeight;
        }    
    });


    useEffect(()=>{

        const socketInitializer = async () =>{

            await fetch('/api/socket');

            socketRef.current = io();

            socketRef.current.on('connect', ()=>{
            })

            socketRef.current.on('message-received', (msg: string) =>{
                setMessages((prev: Message[])=> [...prev, {msg, mine: false}])
                socketRef.current?.emit('message-delivered', msg);
            });

            socketRef.current.on('message-delivered', (msg: string) =>{
                
            })
            socketRef.current.on('typing', (msg: string) =>{
                setTyping(true);
            })

            socketRef.current.on('not-typing', (msg: string) =>{
                setTyping(false);
            })

        }

        socketInitializer();

    }, []);

    return <div className={'messenger'}  ref={messageBoxRef}>
        <div className={"message_box"}>
            {messages.map(message=><p key={Math.random()} className={message.mine?'flex-right':'flext-left'}>{message.msg}</p>)}
            {typing && <p className="flext-left">...typing</p>}
        </div>
        <form onSubmit={submitHandler}>
            <input type={'message'} placeholder="Message..." ref={inputRef} value={messageInput} onChange={inputChangeHandler} onFocus={inputChangeHandler} onBlur={inputChangeHandler}></input>
            <input type="submit" value="Send"></input>
        </form>
    </div>
}

export default ChatPage;