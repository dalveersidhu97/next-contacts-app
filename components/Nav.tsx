import Link from "next/link";
import React, {useContext } from "react";
import { LoginContext } from '../store/LoginContext';

const Nav = () => {
    const context =  useContext(LoginContext);
    const logoutHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        context.logout();
    }

    return <div>
        <nav>
        {context.user && <ul>
            <li><Link href={'/'}>Home</Link></li>
            {/* <li><Link href={'/dashboard'}>Dashboard</Link></li> */}
            {/* <li><Link href={'/contacts'}>Contacts</Link></li> */}
            <li><Link href={'/add-contact'}>Add contact</Link></li>
            <li><Link href={'/profile'}>Profile</Link></li>
            <li><a href="#" onClick={logoutHandler}>Logout</a></li>
        </ul>}
        {!context.user && <ul>
            <li><Link href={'/login'}>Login</Link></li>
            <li><Link href={'/signup'}>Signup</Link></li>
        </ul>}
    </nav>
        {context.user &&
            <h4><img src={context.user!.image} width={50} height={50} style={{borderRadius: "50%", verticalAlign: "middle", objectFit: "cover"}}/> {context.user?.name}</h4>
        }
    </div>
}

export default Nav;