import {useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Geral.module.css";
import Container from "../layout/Container";
import LinkButton from "../layout/LinkButton";
import ItemCard from "../itens/ItemCard";
import Mensagem from "../layout/Mensagem";

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

function Geral () {
    const location = useLocation();
    const [restaurante, setRestaurante] = useState([]);
    const [msg, setMsg] = useState("");

    let mensagem = "";
    if (location.state) {
        mensagem = location.state.mensagem;
    }

    useEffect (()=> {
        fetch("http://localhost:8080/restaurante",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((r)=>r.json())
        .then((dados)=>{setRestaurante(dados);})
        .catch((erro)=>console.log(erro));
    },[])

    function removeRestaurante(id:number) {
        setMsg("");
        fetch(`http://localhost:8080/restaurante/${id}`,{
            method: "DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((r)=>r.json())
        .then( () => {
            setRestaurante(restaurante.filter(
                (res:TipoType) => res.id !== id
            ));
            setMsg("Item removido com sucesso!");
        }).catch((err)=>console.log(err) );
    }

    return (
        <div className={styles.geral_container}>
            {mensagem && <Mensagem msg={mensagem} type="sucesso" />}
            {msg && <Mensagem msg={msg} type="sucesso" />}
            <div className={styles.title_container} >
                <h1>Restaurante</h1>
                <LinkButton to="/novo" text="Novo Item" />
            </div>
            <Container customClass="start">
                { restaurante.length > 0 && 
                    restaurante.map((res: RestauranteData) => (
                        <ItemCard id={res.id}
                        name={res.name}
                        price={res.price}
                        tipo={res.tipos.name}
                        key={res.id}
                        handleRemove={removeRestaurante}
                        />
                    ))
                }
                { restaurante.length === 0 && 
                    <p>Não há itens cadastrados!</p>
                }
            </Container>
        </div>
    );
}

export default Geral;