import { useParams } from "react-router-dom";
import styles from "./PaginaEdicao.module.css";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Mensagem from "../layout/Mensagem";
import Container from "../layout/Container";
import ItemForm from "../Itens/ItemForm";
import IngredientesForm from "../Itens/IngredientsForm";
import ValorCard from "../Itens/ValorCard";

interface TipoType {
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
    name: string;
    price: number;
    tipos: TipoType;
    total: number;
    valores: ValorType[];
}

function PaginaEdicao() {
    const { id } = useParams<{ id: string }>();
    const [restaurante, setRestaurante] = useState<RestauranteData>();
    const [showItemForm, setShowItemForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [type, setType] = useState("");
    const [valores, setValores] = useState<ValorType[]>([]);
    useEffect(() => {
        fetch(`http://localhost:8080/restaurante/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((resp) => resp.json())
            .then((dados) => {
                setRestaurante(dados);
                setValores(dados.valores);
            })
            .catch((e) => console.log(e));
    }, [id]);
    function editPost(res: RestauranteData) {
        setMensagem("");
        if (res.price < res.total) {
            setMensagem("O preço de custo não pode ser menor que o preço do Item");
            setType("erro");
            return false;
        }

        fetch(`http://localhost:8080/restaurante/${res.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(res)
        })
            .then((res) => res.json())
            .then((data) => {
                setRestaurante(data);
                setShowItemForm(false);
                setMensagem("Item Atualizado!");
                setType("sucesso");
            })
            .catch((erro) => console.log(erro));
    }

    function createIngrediente(restaurante: RestauranteData) {
        setMensagem("");
        const ultimoCusto = restaurante.valores[restaurante.valores.length - 1];
        ultimoCusto.id = uuidv4();
        const novoCusto = Number(restaurante.total) + Number(ultimoCusto.custo);
    
        if (novoCusto > Number(restaurante.price)) {
            setMensagem("Custo total maior que o preço de venda!");
            setType("erro");
            restaurante.valores.pop();
            return false;
        }
        
        restaurante.total = novoCusto; // Adicione esta linha
    
        fetch(`http://localhost:8080/restaurante/${restaurante.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(restaurante)
        })
            .then((res) => res.json())
            .then(() => {
                setShowServiceForm(false);
                setMensagem("Valor Atualizado!");
                setType("sucesso");
            })
            .catch((erro) => console.log(erro));
    }
    

    function removerCusto(id: string, total: number) {
        setMensagem("");
        if (!restaurante) return;
        const atualizaCusto =
            restaurante.valores.filter((valor) => valor.id !== id);
        const atualizaRestaurante = restaurante;
        atualizaRestaurante.valores = atualizaCusto;
        atualizaRestaurante.total =
            Number(atualizaRestaurante?.total) - Number(total);
        fetch(`http://localhost:8080/restaurante/${restaurante.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizaRestaurante)
        })
            .then((res) => res.json())
            .then(() => {
                setRestaurante(atualizaRestaurante);
                setValores(atualizaCusto);
                setMensagem("Valor Removido com Sucecesso!");
                setType("sucesso");
            })
            .catch((erro) => console.log(erro));
    }

    function toggleItemForm() {
        setShowItemForm(!showItemForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {restaurante?.name ? (
                <div className={styles.pagina_details}>
                    {mensagem && <Mensagem msg={mensagem} type={type} />}
                    <Container customClass="column">
                        <div className={styles.details_container}>
                            <h1>Nome do Produto: {restaurante.name} </h1>
                            <button className={styles.btn} onClick={toggleItemForm}>
                                {!showItemForm ? "Editar Item" : "Fechar Edição"}
                            </button>
                            {!showItemForm ? (
                                <div className={styles.pagina_info}>
                                    <p>
                                        <span>Tipo: </span> {restaurante.tipos.name}
                                    </p>
                                    <p>
                                        <span>Preço do Item: </span> R${" "}
                                        {(restaurante.price - 0).toFixed(2)}
                                    </p>
                                    <p>
                                        <span>Preço de Custo: </span> R${" "}
                                        {(restaurante.total - 0).toFixed(2)}
                                    </p>
                                    <p>
                                        <span>Lucro: </span>R${" "}
                                        {(restaurante.price - restaurante.total).toFixed(2)}
                                    </p>
                                </div>
                            ) :
                                (
                                    <div className={styles.pagina_info}>
                                        <ItemForm handleSubmit={editPost}
                                            btnText="Concluir Edição"
                                            restauranteData={restaurante} />
                                    </div>
                                )}
                        </div>
                        <div className={styles.form_container}>
                            <h2>Adicionar Custo</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? "Adicionar Custos" : "Fechar"}
                            </button>
                            <div className={styles.pagina_info}>
                                {showServiceForm && (
                                    <div>
                                        <IngredientesForm
                                            handleSubmit={createIngrediente}
                                            btnText="Adicionar Custo"
                                            itemData={restaurante}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <h2>Custos</h2>
                        <Container customClass="start">
                            {valores.length > 0 && valores.map((valor: ValorType) => (
                                <ValorCard
                                    id={valor.id}
                                    name={valor.name}
                                    custo={valor.custo}
                                    key={valor.id}
                                    handleRemove={removerCusto}
                                />
                            ))}
                            {valores.length === 0 && <p>Não há valores cadastrados</p>}
                        </Container>
                    </Container>
                </div>
            ) : () => <div className={styles.pagina_details}>
                <h1>Nada por aqui ainda!</h1>
            </div>
            }
        </>
    )
}

export default PaginaEdicao;
