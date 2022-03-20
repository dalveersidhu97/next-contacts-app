import { FC } from "react";
import Nav from "./Nav";

const Layout: FC = (props) => {
    return <div>
        <header>
            <Nav></Nav>
        </header>
        <main>
            {props.children}
        </main>
    </div>
}

export default Layout;