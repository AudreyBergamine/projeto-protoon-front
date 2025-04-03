import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import cidadaoImg from '../../assets/cidadao.jpg';
import logoImg from '../../assets/logo.png';
import coordednadorImg from '../../assets/coordenador.png';
import funcionarioImg from '../../assets/funcionario.png';
import secretarioImg from '../../assets/secretario.png';
import URL from '../services/url';
import styles from './Header.module.css';

function Header({ isAuthenticated, role }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [cidade, setCidade] = useState("Ferraz de Vasconcelos");
    const [secretaria, setSecretaria] = useState("");

    const axiosInstance = axios.create({
        baseURL: URL,
        withCredentials: true
    });

    const token = localStorage.getItem('token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    useEffect(() => {
        document.addEventListener('click', notToggleMenu);

        return () => {
            document.removeEventListener('click', notToggleMenu);
        };

        async function fetchFuncionario() {
            try {
                const response = await axiosInstance.get(`/protoon/funcionarios/bytoken`);
                const nomeSecretaria = response.data.secretaria.nome_secretaria;
                localStorage.setItem("nome_secretaria", nomeSecretaria);
                setSecretaria(nomeSecretaria);
            } catch (error) {
                console.error('Erro ao buscar o protocolo:', error);
            }
        }

        if (isAuthenticated && role !== "MUNICIPE") {
            fetchFuncionario();
        }
    }, [menuOpen, isAuthenticated, role]);

    const handleLogout = async () => {
        try {
            await axiosInstance.post(`${URL}/protoon/logout`);
            localStorage.clear();
            window.location.href = '/';
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(prevState => !prevState);
    };

    const notToggleMenu = () => {
        if (menuOpen) {
            setMenuOpen(false);
        }
    };

    const handleChange = (event) => {
        setCidade(event.target.value);
    };

    // Funções de navegação
    const navigateTo = (path, e) => {
        navigate(path);
        toggleMenu(e);
    };

    const getAvatarImage = () => {
        switch(role) {
            case "FUNCIONARIO": return funcionarioImg;
            case "SECRETARIO": return secretarioImg;
            case "COORDENADOR": return coordednadorImg;
            default: return cidadaoImg;
        }
    };

    const getProfilePath = () => {
        switch(role) {
            case "FUNCIONARIO": return "/perfil-funcionario";
            case "SECRETARIO": return "/perfil-secretario";
            case "COORDENADOR": return "/perfil-coordenador";
            default: return "/perfil";
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <a href="/">
                    <img className={styles.logo} src={logoImg} alt="Logo do site" />
                </a>
                <select
                    className={styles.citySelector}
                    name="Cidade"
                    value={cidade}
                    onChange={handleChange}
                >
                    <option value="Ferraz de Vasconcelos">Ferraz de Vasconcelos</option>
                    <option value="Mogi das Cruzes">Mogi das Cruzes</option>
                    <option value="Suzano">Suzano</option>
                    <option value="Poá">Poá</option>
                    <option value="Itaquaquecetuba">Itaquaquecetuba</option>
                </select>
            </div>

            <div className={styles.navContainer}>
                <ul className={styles.navLinks}>
                    {secretaria && (
                        <li className={styles.navItem}>
                            <span className={styles.secretariaName}>{secretaria}</span>
                        </li>
                    )}
                    
                    <li className={styles.navItem}>
                        <a href="#" className={styles.navLink}>Serviços</a>
                        <ul className={styles.submenu}>
                            <li className={styles.submenuItem}>
                                <a href="./reclamar" className={styles.submenuLink}>Abrir reclamação</a>
                            </li>
                            <li className={styles.submenuItem}>
                                <a href="/consultar" className={styles.submenuLink}>Consultar protocolos</a>
                            </li>
                        </ul>
                    </li>
                    
                    <li className={styles.navItem}>
                        <a href="#" className={styles.navLink}>Mais</a>
                        <ul className={styles.submenu}>
                            <li className={styles.submenuItem}>
                                <a href="./contato" className={styles.submenuLink}>Contato</a>
                            </li>
                            <li className={styles.submenuItem}>
                                <a href="./sobreNos" className={styles.submenuLink}>Sobre nós</a>
                            </li>
                        </ul>
                    </li>
                </ul>

                {isAuthenticated && (
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatar} onClick={toggleMenu}>
                            <img src={getAvatarImage()} alt="Foto do Usuário" />
                        </div>
                        {menuOpen && (
                            <div className={styles.menu}>
                                <ul className={styles.menuItem}>
                                    <li>
                                        <a 
                                            onClick={(e) => navigateTo(getProfilePath(), e)} 
                                            className={styles.menuLink}
                                        >
                                            Perfil
                                        </a>
                                    </li>
                                    <li>
                                        <a 
                                            onClick={handleLogout} 
                                            className={styles.menuLink}
                                        >
                                            Sair
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;