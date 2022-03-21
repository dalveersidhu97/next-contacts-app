import { NextComponentType, NextPage } from "next";
import { PropsWithChildren, useContext } from "react";
import { LoginContext } from "../store/LoginContext";
import LoginUser from "../types/LoginUser";

function withVerifyAuthClient<T>(nextFn: (props: PropsWithChildren<T>)=>JSX.Element){


    const useFunction: NextPage<T & {loginUser: LoginUser}> = (props) => {
        const context = useContext(LoginContext);
        // login logic
        console.log('Verifing login');
        
        if(!props.loginUser) {
            console.log(props.loginUser);
            context.logout();
            return <div>Loading</div>
        }
        
        else
            return nextFn(props);
    }

    return useFunction;    

}

export default withVerifyAuthClient;