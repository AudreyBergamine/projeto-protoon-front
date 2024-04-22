
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import cidadaoImg from '../../assets/cidadao.jpg';
function Header({ isAuthenticated, role}) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/protoon/',
        withCredentials: true
    });
    const homePage = async () =>{
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
                <div className="title-proton"><a href="/">PROTO-ON</a></div>
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
                                            <li><a href="updateMunicipe.php" style={{ fontWeight: 'bold' }}>Perfil</a></li>
                                            <li><a href="../view/suporte-cliente.php" style={{ fontWeight: 'bold' }}>Suporte</a></li>
                                            <li><button onClick={handleLogout} style={{ fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Sair</button></li>
                                        </div>
                                    </ul>
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