import styles from "./Home.module.css";
import help from "../../img/help.png";
import LinkButton from "../layout/LinkButton";

function Home (){
    return (
        <section className={styles.home}>
            <h1>
                Bem vindo ao <span>Site de Ajuda</span>
            </h1>
            <p>Este site é um exemplo para React!!</p>
            <LinkButton to="/NovaPagina" text="Nova Página" />
            <img src={help} alt="Help" />
        </section>
    );
}
export default Home;