import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

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
import PerfilMunicipe from '../components/municipe/perfilMunicipe';
import ReclamacoesRetornadasMunicipe from '../components/municipe/reclamacoesRetornadasMunicipe';

import CadastrarFuncionario from '../components/secretario/cadastrarFuncionarios';
import ListarFuncionarios from '../components/secretario/listarFuncionarios';
import ListarProtocolosBySecretaria from '../components/gerais/listarProtocolos';
import AnalisarProtocolos from '../components/gerais/analisarProtocolos';
import AnalisarFuncionarios from '../components/secretario/analisarFuncionarios';
import PerfilSecretario from '../components/secretario/perfilSecretario';
import PerfilCoordenador from '../components/coordenador/perfilCoord';
import PerfilFuncionario from '../components/funcionario/perfilFuncionario';

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
            <Route path="/cadastrar-municipe" element={<CadastrarMunicipe />} />
            <Route path="/recuperar-senha" element={<RecuperarSenhaForm />} />
            <Route path="/atualizar-senha" element={<AtualizarForm />} />
            <Route path="/pagina-inicial" element={<PaginaInicalMunicipe />} />
            <Route path="/reclamar" element={<Reclamar />} />
            <Route path="/consultar" element={<Consultar />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/retornadas" element={<ReclamacoesRetornadasMunicipe />} />
            <Route path="/perfil" element={<PerfilMunicipe />} />
            
            {/* SECRETARIO */}
            <Route path="/cadastrar-funcionarios" element={<CadastrarFuncionario />} />
            <Route path="/funcionarios" element={<ListarFuncionarios />} />
            <Route path="/funcionario/:id" element={<AnalisarFuncionarios />} />
            <Route path="/perfil-secretario" element={<PerfilSecretario />} />
            {/* Rota de redirecionamento padrão */}

            {/* COORDENADOR */}
            <Route path="/perfil-coordenador" element={<PerfilCoordenador />} />

            {/* FUNCIONARIO */}
            <Route path="/perfil-funcionario" element={<PerfilFuncionario />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;
