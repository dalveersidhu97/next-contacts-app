import { NextComponentType, NextPage, NextPageContext } from "next";
import Router from "next/router";
import React, { PropsWithChildren, useContext, useEffect } from "react";
import { LoginContext } from "../store/LoginContext";
import LoginUser from "../types/LoginUser";

function withVerifyAuthClient<T>(nextFn: (p: T)=>JSX.Element) {


    const useFunction: NextPage<T & {loginUser: LoginUser}> = (props) => {

        console.log('withVerifyAuthClient', props)

        const context = useContext(LoginContext);

        useEffect(()=>{
            
            if(!props.loginUser){
                context.logout()
                Router.replace('/login');
            }
        });

        if(!props.loginUser) return <div>...Redirecting. Not logged In.</div>
        
        if(!props.loginUser) {
            console.log(props.loginUser);
            context.logout();
            
        }
    
        return nextFn(props);
    }

    return useFunction;    

}

export default withVerifyAuthClient;