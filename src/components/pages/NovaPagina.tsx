import { useNavigate } from "react-router-dom";
import ItemForm from "../itens/ItemForm";
import styles from "./NovaPagina.module.css";

interface TipoType{
    id: number;
    name: string;
}

interface ValorType {
    id?: string;
    name?: string;
    custo?: number;
    descricao?: string;
}

interface RestauranteData {
    id: number;
    name:string;
    price: number;
    tipos: TipoType;
    total: number;
    valores: ValorType[];
}

function NovaPagina () {
    const history = useNavigate();
    function createPost(restaurante: RestauranteData) {
        restaurante.total = 0;
        restaurante.valores = [];
        fetch("http://localhost:8080/restaurante",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(restaurante),
        })
        .then((resp) =>resp.json())
        .then((data) => {
            console.log (data);
            history("/restaurante", {
                state: {
                    message:"Item criado com sucesso!"
                }
            });
        })
        .catch((erro)=> console.log(erro));
    }

    return (
        <div className={styles.novapagina_container}>
            <h1> Cadastro de Itens</h1>
            <p>Adicione um item do restaurante: </p>
            <ItemForm handleSubmit={createPost} btnText="Enviar" />
        </div>
    );
}
export default NovaPagina;