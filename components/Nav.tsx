import Link from "next/link";
import React, {useContext } from "react";
import { LoginContext } from '../store/LoginContext';
import styles from './Nav.module.css';
import { useRouter } from 'next/router'

const Nav = () => {
    const router = useRouter();
    const context =  useContext(LoginContext);
    const logoutHandler = async (e: React.MouseEvent) => {
        e.preventDefault();
        context.logout();
        router.replace('/login');
    }

    return <>

        <h1 className={styles.header}>
        {context.user &&
            <>
                <img src={context.user!.image}/> 
                <span>{context.user?.name}</span>
            </>
        }
        </h1>

        <nav className={styles.nav}>
        {context.user && <ul>
            <li><Link href={'/'}>Contacts On App</Link></li>
            <li><Link href={'/all-contacts'}>Your contacts</Link></li>
            <li><Link href={'/add-contact'}>Add contact</Link></li>
            <li><Link href={'/chat'}>Chat Room</Link></li>
            <li><Link href={'/profile'}>Profile</Link></li>
            <li><a href="#" onClick={logoutHandler}>Logout</a></li>
        </ul>}
        {!context.user && <ul>
            <li><Link href={'/login'}>Login</Link></li>
            <li><Link href={'/signup'}>Signup</Link></li>
        </ul>}
    </nav>
    </>
}

export default Nav;