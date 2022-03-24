import { FC, useState } from "react";
import Nav from "./Nav";
import styles from './Layout.module.css';
import NextRouter from 'next/router';

type RouterType = typeof NextRouter & {onRouteChangeStart: ()=>void, onRouteChangeComplete: ()=>void}

const Layout: FC = (props) => {

    const [loading, setLoading] = useState(false);
    const Router : RouterType = NextRouter as RouterType;
    
    Router.onRouteChangeStart = () => {
        setLoading(true);
    }

    Router.onRouteChangeComplete = () => {
        setLoading(false);
    }


    return <div>
        <header className={styles.main_header}>
            <Nav></Nav>
        </header>
        <main className={styles.main}>
            {loading ? <div>...loading</div> : props.children }
        </main>
    </div>
}

export default Layout;