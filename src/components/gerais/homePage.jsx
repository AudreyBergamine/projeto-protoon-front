import PaginaInicial from "../municipe/paginaInicialMunicipe/paginaInicialMunicipe";
import PaginaInicialSecretario from "../secretario/paginaInicialSec/paginaInicialSec";
import PaginaInicialCoordenador from "../coordenador/paginaInicialCoordenador/paginaInicialCoord";
import PaginaInicialFuncionario from "../funcionario/paginaInicialFuncionario/paginaInicialFuncionario";
import { useNavigate } from "react-router-dom";
function Home({ isAuthenticated, role }) {
    //TODO: Criar página inicial de funcionário e implementar a lógica abaixo, igual fiz com a de municipe
    const navigate = useNavigate()
    console.log(process.env.REACT_APP_API_URL)
    console.log(process.env.REACT_APP_SCORE_API_URL)
    const sendToCadastrarMunicipe = async()=>{
        navigate("/cadastrar-municipe")
    }
    const sendToLogin = async()=>{
        navigate("/login")
    }

    if (isAuthenticated && role === "MUNICIPE") {
        return (<div>
            <PaginaInicial />
        </div>)
    }

    if (isAuthenticated && role === "SECRETARIO") {
        return (<div>
            <PaginaInicialSecretario />
        </div>)
    }

    if (isAuthenticated && role === "COORDENADOR") {
        return (<div>
            <PaginaInicialCoordenador />
        </div>)
    }

    if (isAuthenticated && role === "FUNCIONARIO") {
        return (<div>
            <PaginaInicialFuncionario />
        </div>)
    }

    return (
        <div>
            <main>
                <h1 className="main-title" style={{ marginTop: 200 }}>BEM VINDO AO PROTO-ON</h1>
                <div className="btn-container">
                    <button className="btn-log" onClick={sendToLogin}>Login</button>
                    <button className="btn-cad" onClick={sendToCadastrarMunicipe}>Cadastro</button>
                </div>
            </main>
        </div>
    )
}

export default Home;