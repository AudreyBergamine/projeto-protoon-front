import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Home from '../components/gerais/homePage';
//import Home from '../components/gerais/login/login'
import LoginForm from '../components/gerais/login/login';

import CadastroAssunto from '../components/coordenador/cadastroAssunto/cadastroAssunto';
import CadastrarMunicipe from '../components/municipe/cadastrarMunicipe/cadastrarMunicipe';
import RecuperarSenhaForm from '../components/municipe/recuperarSenha/recuperarSenha';
import AtualizarForm from '../components/municipe/atualizarSenha';
import PaginaInicalMunicipe from '../components/municipe/paginaInicialMunicipe/paginaInicialMunicipe';
import Reclamar from '../components/gerais/reclamar/reclamar';
import SolicitarServico from '../components/gerais/solicitarServico/solicitarServico';
import Consultar from '../components/municipe/consultar/consultar';
import SobreNos from '../components/municipe/sobreNos';
import Contato from '../components/municipe/contato';
import PerfilMunicipe from '../components/municipe/perfilMunicipe';
import ReclamacoesRetornadasMunicipe from '../components/municipe/reclamacoesRetornadasMunicipe';
import TodasDevolutivas from '../components/gerais/todasDevolutivas/todasDevolutivas';
import CadastrarFuncionario from '../components/secretario/cadastrarFuncionarios';
import ListarFuncionarios from '../components/secretario/listarFuncionarios';
import ListarProtocolosBySecretaria from '../components/gerais/listarProtocolos/listarProtocolos';
import AnalisarProtocolos from '../components/gerais/analisarProtocolo/analisarProtocolos';
import AnalisarFuncionarios from '../components/secretario/analisarFuncionarios';
import PerfilSecretario from '../components/secretario/perfilSecretario';
import PerfilCoordenador from '../components/coordenador/perfilCoord';
import PerfilFuncionario from '../components/funcionario/perfilFuncionario';
import Logs from '../components/coordenador/logs';
import Relatorios from '../components/coordenador/relatorios';
import RedirecionamentosCoordenador from '../components/gerais/redirecionamentos';
import RedirecionamentosFuncionario from '../components/funcionario/redirecionamentosFuncionario';
import GerenciarSecretaria from '../components/coordenador/GerenciarSecretaria/GerenciarSecretaria';
import AnalisarComprovantes from '../components/gerais/analisarComprovante/analisarComprovante';
// Defina um conjunto de rotas privadas
const privateRoutes = ['/protocolos', '/protocolo/', '/retornadas', '/reclamar', '/consultar', '/perfil',
'/cadastrar-funcionarios', '/funcionarios', '/funcionario/', '/perfil-secretario', '/perfil-funcionario', 'perfil-coordenador' ];
// const privateRoutes = ['/reclamar', '/outra-rota-privada'];

function AppRoutes({ isAuthenticated, role }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isPrivateRoute = privateRoutes.some(route => location.pathname.startsWith(route));


        // Redirecionamentos com base no estado de autenticação e nas rotas privadas
        if ((location.pathname === '/login' || location.pathname === '/cadastrar-municipe' ) && isAuthenticated) {
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
            <Route path="/todas-devolutivas/:id" element={<TodasDevolutivas />} />
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} role={role} />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/protocolos" element={<ListarProtocolosBySecretaria />} />
            <Route path="/protocolo/:id" element={<AnalisarProtocolos />} />
            <Route path="/redirecionamentos-coordenador" element={<RedirecionamentosCoordenador />} />
            <Route path="/analisar-comprovantes" element={<AnalisarComprovantes />} />


            {/* MUNICIPE */}  
            <Route path="/cadastrar-municipe" element={<CadastrarMunicipe />} />
            <Route path="/recuperar-senha" element={<RecuperarSenhaForm />} />
            <Route path="/atualizar-senha" element={<AtualizarForm />} />
            <Route path="/pagina-inicial" element={<PaginaInicalMunicipe />} />
            <Route path="/reclamar" element={<Reclamar />} />
            <Route path="/solicitarServico" element={<SolicitarServico />} />
            <Route path="/consultar" element={<Consultar />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/retornadas" element={<ReclamacoesRetornadasMunicipe />} />
            <Route path="/perfil" element={<PerfilMunicipe />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/logs" element={<Logs />} />
            
            {/* SECRETARIO */}
            <Route path="/cadastrar-funcionarios" element={<CadastrarFuncionario />} />
            <Route path="/funcionarios" element={<ListarFuncionarios />} />
            <Route path="/funcionario/:id" element={<AnalisarFuncionarios />} />
            <Route path="/perfil-secretario" element={<PerfilSecretario />} />
            {/* Rota de redirecionamento padrão */}

            {/* COORDENADOR */}
            <Route path="/perfil-coordenador" element={<PerfilCoordenador />} />
            <Route path="/gerenciar-secretaria" element={<GerenciarSecretaria />} />
            <Route path="/cadastrar-assunto" element={<CadastroAssunto />} />

            {/* FUNCIONARIO */}
            <Route path="/perfil-funcionario" element={<PerfilFuncionario />} />
            <Route path="/redirecionamentos-funcionario" element={<RedirecionamentosFuncionario />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;
