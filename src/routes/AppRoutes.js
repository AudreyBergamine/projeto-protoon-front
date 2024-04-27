import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/gerais/homePage';
import LoginForm from '../components/gerais/login';
import CadastrarMunicipe from '../components/municipe/cadastrarMunicipe';
import RecuperarSenhaForm from '../components/municipe/recuperarSenha';
import AtualizarForm from '../components/municipe/atualizarSenha';
import PaginaInicalMunicipe from '../components/municipe/paginaInicalMunicipe';
import Reclamar from '../components/municipe/reclamar';
import Consultar from '../components/municipe/consultar';
import SobreNos from '../components/municipe/sobreNos';
import Contato from '../components/municipe/contato';
import RegisterFuncionario from '../components/secretario/cadastrarFuncionarios';
import ReclamacoesRetornadasMunicipe from '../components/municipe/reclamacoesRetornadasMunicipe';
import { useLocation, useNavigate } from 'react-router-dom';
import ListarProtocolosBySecretaria from '../components/gerais/listarProtocolos';
import AnalisarProtocolos from '../components/gerais/analisarProtocolos';
import PerfilMunicipe from '../components/municipe/perfilMunicipe';

// Defina um conjunto de rotas privadas
const privateRoutes = ['/outra-rota-privada'];
// const privateRoutes = ['/reclamar', '/outra-rota-privada'];

function AppRoutes({ isAuthenticated, role }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isPrivateRoute = privateRoutes.includes(location.pathname);

        // Redirecionamentos com base no estado de autenticação e nas rotas privadas
        if ((location.pathname === '/login' || location.pathname === '/cadastro') && isAuthenticated) {
            navigate('/', { replace: true });
        } else if (isPrivateRoute && !isAuthenticated && location.pathname !== '/') {
            navigate('/', { replace: true });
        } else if (isPrivateRoute && !isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, location, navigate]);

    return (
        <Routes>
            {/* GERAIS (Rotas onde 3 ou mais entidades usam) */} 
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} role={role} />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/protocolos" element={<ListarProtocolosBySecretaria />} />
            <Route path="/protocolo/:id" element={<AnalisarProtocolos />} />
            {/* MUNICIPE */}  
            <Route path="/cadastrarMunicipe" element={<CadastrarMunicipe />} />
            <Route path="/recuperarSenha" element={<RecuperarSenhaForm />} />
            <Route path="/atualizarSenha" element={<AtualizarForm />} />
            <Route path="/paginaInicial" element={<PaginaInicalMunicipe />} />
            <Route path="/reclamar" element={<Reclamar />} />
            <Route path="/consultar" element={<Consultar />} />
            <Route path="/sobreNos" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/retornadas" element={<ReclamacoesRetornadasMunicipe />} />
            <Route path="/perfil" element={<PerfilMunicipe />} />
            
            {/* SECRETARIO */}
            <Route path="/cadastro-funcionarios" element={<RegisterFuncionario />} />

            {/* Rota de redirecionamento padrão */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;
