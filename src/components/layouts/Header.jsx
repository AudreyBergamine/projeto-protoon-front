
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import cidadaoImg from '../../assets/cidadao.jpg';
import logoImg from '../../assets/logo.png';
import coordednadorImg from '../../assets/coordenador.png'
import funcionarioImg from '../../assets/funcionario.png'
import secretarioImg from '../../assets/secretario.png'
import URL from '../services/url';
// import { RedirectWithToggle, RedirectWithoutToggle } from '../../routes/Redirect';

function Header({ isAuthenticated, role }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [cidade, setCidade] = useState("Ferraz de Vasconcelos");

    const axiosInstance = axios.create({
        baseURL: URL,
        withCredentials: true
    });

    // Recuperar o token do localStorage
    const token = localStorage.getItem('token');

    const secretaria = localStorage.getItem('nome_secretaria');


    // Adicionar o token ao cabeçalho de autorização
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    useEffect(() => {
        document.addEventListener('click', notToggleMenu);

        return () => {
            document.removeEventListener('click', notToggleMenu);
        };

        async function fetchFuncionario() {
            try {
                const response1 = await axiosInstance.get(`/protoon/funcionarios/bytoken`);
                const nome_secretaria = response1.data.secretaria.nome_secretaria; // Obtém o valor do celular do funcionário
                localStorage.setItem("nome_secretaria", nome_secretaria);

            } catch (error) {
                console.error('Erro ao buscar o protocolo:', error);
            }
        }

        fetchFuncionario();
    }, [menuOpen]);

    const handleLogout = async () => {
        try {
            await axiosInstance.post(`${URL}/protoon/logout`);
            // Remover o cookie definindo um novo cookie com o mesmo nome e um tempo de expiração passado
            localStorage.clear();
            window.location.href = '/'; // Redirecionar para a página inicial após o logout
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    //Função para ativar e desativar o menuzinho quando clicar na foto do usuário
    const toggleMenu = (e) => {
        e.stopPropagation(); // Impede a propagação do evento para o documento
        setMenuOpen(prevState => !prevState); //expressão lambda se um for verdadeiro é troca para falso (e vice-versa)
    };
    const notToggleMenu = () => {
        if (menuOpen) {
            setMenuOpen(false)
        }
    }

    //TROCAR DE ROTAS

    //MUNICIPES
    const sendToPerfilMunicipe = async (e) => {
        navigate("/perfil"); // Redirecionar para protocolo
        toggleMenu(e) //Desativa o menu
    }

    const sendToConsultar = async (e) => {
        navigate("/consultar"); // Redirecionar para protocolo
        toggleMenu(e)
    }

    //FUNCIONARIOS
    const sendToProtocolos = async (e) => {
        navigate("/protocolos"); // Redirecionar para protocolo
        toggleMenu(e)
    }
    const sendToPerfilSecretario = async (e) => {
        navigate("/perfil-secretario"); // Redirecionar para protocolo
        toggleMenu(e)
    }
    const sendToPerfilCoordenador = async (e) => {
        navigate("/perfil-coordenador"); // Redirecionar para protocolo
        toggleMenu(e)
    }
    const sendToPerfilFuncionario = async (e) => {
        navigate("/perfil-funcionario"); // Redirecionar para protocolo
        toggleMenu(e)
    }

    const handleChange = (event) => {
        setCidade(event.target.value);
    };

    return (
        <div>
            <header className="header">
                <div className="title-proton">
                    <a href="/">
                        <img className="logo" id="cidadao" src={logoImg} alt="Logo do site" style={{ height: 60, marginLeft: -30 }} />
                    </a>
                </div>
                <div>
                    <select
                        style={{ fontSize: 20, padding: 10, borderRadius: 10, textAlign: "center", appearance: "none", }}
                        name="Cidade"
                        value={cidade} // Estado que controla a cidade selecionada
                        onChange={handleChange}
                    >
                        <option value="Ferraz de Vasconcelos">Ferraz de Vasconcelos</option>
                        <option value="Mogi das Cruzes">Mogi das Cruzes</option>
                        <option value="Suzano">Suzano</option>
                        <option value="Poá">Poá</option>
                        <option value="Itaquaquecetuba">Itaquaquecetuba</option>
                    </select>
                </div>

                <nav>
                    <div style={{ marginLeft: '20%', textAlign: 'right' }}>
                        <ul className="nav-links">
                            <li style={{ minWidth: 200, marginRight: 50 }}>
                                <a
                                    href="$"
                                    style={{
                                        cursor: "default",
                                        textDecoration: "none", // Remove sublinhado
                                        pointerEvents: "none",  // Impede interações com o link
                                    }}
                                >
                                    {secretaria}
                                </a>
                            </li>
                            <li style={{ marginLeft: 80, textAlign: 'right' }}>
                                <a href="#">Serviços</a>
                                <ul className='submenu'>
                                    <li><a href="./reclamar">Abrir reclamação</a></li>
                                    <li><a href="/consultar">Consultar protocolos</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Mais</a>
                                <ul className="submenu">
                                    <li><a href="./contato">Contato</a></li>
                                    <li><a href="./sobreNos">Sobre nós</a></li>
                                </ul>
                            </li>

                        </ul>
                    </div>
                </nav>
                <nav>
                    <ul className="nav-links">
                        {isAuthenticated && role === "MUNICIPE" && (
                            <div className="avatar-container">
                                <div className="avatar" id="avatar">
                                    <img className="cidadao" src={cidadaoImg} alt="Foto do Usuário" onClick={toggleMenu} />

                                </div>
                                <div className="menu" id="menu" style={{ display: menuOpen ? 'block' : 'none' }}>
                                    <ul>
                                        <div className="perfilMenu">
                                            <li><a onClick={sendToPerfilMunicipe} style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                            <li><a onClick={handleLogout} style={{ fontWeight: 'bold' }}>Sair</a></li>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {isAuthenticated && role === "FUNCIONARIO" && (
                            <div>
                                <div className="avatar-container">
                                    <div className="avatar" id="avatar">
                                        <img className="cidadao" src={funcionarioImg} alt="Foto do Usuário" onClick={toggleMenu} />
                                    </div>
                                    <div className="menu" id="menu" style={{ display: menuOpen ? 'block' : 'none' }}>
                                        <ul>
                                            <div className="perfilMenu">
                                                <li><a onClick={sendToPerfilFuncionario} style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                                <li><a onClick={handleLogout} style={{ fontWeight: 'bold' }}>Sair</a></li>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isAuthenticated && role === "SECRETARIO" && (
                            <div>
                                <div className="avatar-container">
                                    <div className="avatar" id="avatar">
                                        <img className="cidadao" src={secretarioImg} alt="Foto do Usuário" onClick={toggleMenu} />
                                    </div>
                                    <div className="menu" id="menu" style={{ display: menuOpen ? 'block' : 'none' }}>
                                        <ul>
                                            <div className="perfilMenu">
                                                <li><a onClick={sendToPerfilSecretario} style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                                <li><a onClick={handleLogout} style={{ fontWeight: 'bold' }}>Sair</a></li>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isAuthenticated && role === "COORDENADOR" && (
                            <div>
                                <div className="avatar-container">
                                    <div className="avatar" id="avatar">
                                        <img className="cidadao" src={coordednadorImg} alt="Foto do Usuário" onClick={toggleMenu} />
                                    </div>
                                    <div className="menu" id="menu" style={{ display: menuOpen ? 'block' : 'none' }}>
                                        <ul>
                                            <div className="perfilMenu">
                                                <li><a onClick={sendToPerfilCoordenador} style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                                <li><a onClick={handleLogout} style={{ fontWeight: 'bold' }}>Sair</a></li>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                    </ul>
                </nav>
            </header>
        </div>
    );
}

export default Header;