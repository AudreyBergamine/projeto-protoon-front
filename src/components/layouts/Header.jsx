
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import cidadaoImg from '../../assets/cidadao.jpg';
import logoImg from '../../assets/logo.png';
import coordednadorImg from '../../assets/coordenador.png'
import funcionarioImg from '../../assets/funcionario.png'
import secretarioImg from '../../assets/secretario.png'
function Header({ isAuthenticated, role }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/protoon/',
        withCredentials: true
    });
    const homePage = async () => {
        navigate("/"); // Redirecionar após logout
    }

    const handleLogout = async () => {
        try {
            await axiosInstance.post('logout');
            localStorage.clear();
            window.location.href = '/'; // Redirecionar para a página inicial após o logout
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };


    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    return (
        <div>
            <header className="header">
                <div className="title-proton">
                    <a href="/">
                        <img className="logo" id="cidadao" src={logoImg} alt="Logo do site" style={{ backgroundColor: 'white', borderRadius: '50%', width: 60 }} />
                    </a>
                </div>
                <nav>
                    <div style={{ marginLeft: 800 }}>
                        <ul className="nav-links">
                            <li>
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
                                    <img className="cidadao" id="cidadao" src={cidadaoImg} alt="Foto do Usuário" onClick={toggleMenu} />
                                </div>
                                <div className="menu" id="menu" style={{ display: menuOpen ? 'block' : 'none' }}>
                                    <ul>
                                        <div className="perfilMenu">
                                            <li><a href="" style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                            <li><a href="" style={{ fontWeight: 'bold' }}>Suporte</a></li>
                                            <li><button onClick={handleLogout} style={{ fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button></li>
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {isAuthenticated && role === "FUNCIONARIO" && (
                            <div>
                            <div className="avatar-container">
                                <div className="avatar" id="avatar">
                                    <img className="cidadao" id="cidadao" src={funcionarioImg} alt="Foto do Usuário" onClick={toggleMenu} />
                                </div>
                                <div className="menu" id="menu" style={{ display: menuOpen ? 'block' : 'none' }}>
                                    <ul>
                                        <div className="perfilMenu">
                                            <li><a href="" style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                            <li><a href="" style={{ fontWeight: 'bold' }}>Protocólos</a></li>
                                            <li><button onClick={handleLogout} style={{ fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button></li>
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
                                    <img className="cidadao" id="cidadao" src={secretarioImg} alt="Foto do Usuário" onClick={toggleMenu} />
                                </div>
                                <div className="menu" id="menu" style={{ display: menuOpen ? 'block' : 'none' }}>
                                    <ul>
                                        <div className="perfilMenu">
                                            <li><a href="" style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                            <li><a href="" style={{ fontWeight: 'bold' }}>Editar dados de funcionários</a></li>
                                            <li><button onClick={handleLogout} style={{ fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button></li>
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