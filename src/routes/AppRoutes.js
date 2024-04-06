import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/home-page/homePage';
import LoginForm from '../components/municipe/login';
import RegisterForm from '../components/municipe/register';
import EmailForm from '../components/municipe/recuperarSenha';
import RecuperarForm from '../components/municipe/atualizarSenha';
import PaginaInical from '../components/municipe/paginaInical';
import Reclamar from '../components/municipe/reclamar';
import Consultar from '../components/municipe/consultar';
import SobreNos from '../components/municipe/sobreNos';
import Contato from '../components/municipe/contato';
import LoginAdmin from '../components/admin/loginAdmin';
import TelaAdmin from '../components/admin/welcomeAdmin';
import Teste from '../components/admin/teste';
import TelaUser from '../components/admin/welcomeUser';
import ManterReclamacoes from '../components/admin/manterReclamacoes';
import RegistrarReclamacao from '../components/admin/registrarReclamacao';
import RegisterFormUser from '../components/admin/registerUser';
import UpdateFormUser from '../components/admin/updateUser';
import Reclamacao from '../components/reclamacao/Reclamacao';
import { useLocation, useNavigate } from 'react-router-dom';

// Defina um conjunto de rotas privadas
const privateRoutes = ['/reclamar', '/outra-rota-privada'];

function AppRoutes({ isAuthenticated }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isPrivateRoute = privateRoutes.includes(location.pathname);

        // Redireciona para a página de login se o usuário estiver autenticado e tentar acessar as rotas de login ou cadastro
        if ((location.pathname === '/login' || location.pathname === '/cadastro') && isAuthenticated) {
            navigate('/paginaInicial', { replace: true });
        }

        // Redireciona para a página inicial se o usuário estiver autenticado e tentar acessar outras rotas públicas
        if (!isPrivateRoute && isAuthenticated) {
            navigate('/', { replace: true });
        }

        // Redireciona para a página de login se a rota for privada e o usuário não estiver autenticado
        if (isPrivateRoute && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, location, navigate]);

    return (
        <Routes>
            {/* MUNICIPE */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/cadastro" element={<RegisterForm />} />
            <Route path="/recuperarSenha" element={<EmailForm />} />
            <Route path="/atualizarSenha/:username" element={<RecuperarForm />} />
            <Route path="/paginaInicial" element={<PaginaInical />} />
            <Route path="/reclamar" element={<Reclamar />} />
            <Route path="/consultar" element={<Consultar />} />
            <Route path="/sobreNos" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />

            {/* ADMIN */}
            <Route path="/welcomeAdmin" element={<TelaAdmin />} />
            <Route path="/teste" element={<Teste />} />
            <Route path="/welcomeUser" element={<TelaUser />} />
            <Route path="/updateUser/:username" element={<UpdateFormUser />} />

            {/* Rota de redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;
