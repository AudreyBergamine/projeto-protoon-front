import { useEffect } from 'react';
import PaginaInicial from "../municipe/paginaInicialMunicipe/paginaInicialMunicipe";
import PaginaInicialSecretario from "../secretario/paginaInicialSec/paginaInicialSec";
import PaginaInicialCoordenador from "../coordenador/paginaInicialCoordenador/paginaInicialCoord";
import PaginaInicialFuncionario from "../funcionario/paginaInicialFuncionario/paginaInicialFuncionario";
import { useNavigate } from "react-router-dom";

function Home({ isAuthenticated, role }) {
    const navigate = useNavigate();

    // Redireciona para login se não estiver autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    // Se não estiver autenticado, retorna null enquanto o redirecionamento ocorre
    if (!isAuthenticated) {
        return null;
    }

    const sendToCadastrarMunicipe = async () => {
        navigate("/cadastrar-municipe");
    }

    const sendToLogin = async () => {
        navigate("/login");
    }

    if (role === "MUNICIPE") {
        return (
            <div>
                <PaginaInicial />
            </div>
        )
    }

    if (role === "SECRETARIO") {
        return (
            <div>
                <PaginaInicialSecretario />
            </div>
        )
    }

    if (role === "COORDENADOR") {
        return (
            <div>
                <PaginaInicialCoordenador />
            </div>
        )
    }

    if (role === "FUNCIONARIO") {
        return (
            <div>
                <PaginaInicialFuncionario />
            </div>
        )
    }

    // Página inicial padrão (caso o role não corresponda a nenhum dos acima)
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