import {Link} from "react-router-dom";
import Container from "./Container";
import styles from "./Navbar.module.css";
import logo from "../../img/logo3.png";

function Navbar(){
    return (
        <nav className={styles.navbar}>
            <Container>
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
                <ul className={styles.list}>
                    <li className={styles.item}>
                        <Link to="/">Home</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/aulas">Aulas</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/blabla">Conteudos</Link>
                    </li>
                </ul>
            </Container>
        </nav>
    );
}
export default Navbar;