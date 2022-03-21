import { FC } from "react";
import Nav from "./Nav";
import styles from './Layout.module.css';

const Layout: FC = (props) => {
    return <div>
        <header className={styles.main_header}>
            <Nav></Nav>
        </header>
        <main className={styles.main}>
            {props.children}
        </main>
    </div>
}

export default Layout;