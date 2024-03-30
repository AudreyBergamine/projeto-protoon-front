import React from 'react';
import { BrowserRouter as Router, Routes, Route, redirect } from 'react-router-dom';

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
import LoginFormAuth from '../components/user/authenticate';
import Teste from '../components/user/teste';
import TelaUser from '../components/user/welcomeUser';
import TelaAdmin from '../components/user/welcomeAdmin';
import ManterReclamacoes from '../components/user/manterReclamacoes';
import RegistrarReclamacao from '../components/user/registrarReclamacao';
import RegisterFormUser from '../components/user/registerUser';
import UpdateFormUser from '../components/user/updateUser';

//Esta função, adiciona todos os components (que contém o html junto com funções), para serem exibidos conforme a url inserida
function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/cadastro" element={<RegisterForm />} />
                <Route path="/recuperarSenha" element={<EmailForm />} />
                <Route path="/atualizarSenha/:username" element={<RecuperarForm />} />
                <Route path="/paginaInicial" element={<PaginaInical />} />
                <Route path="/reclamar" element={<Reclamar />} />
                <Route path="/consultar" element={<Consultar />} />
                <Route path="/sobreNos" element={<SobreNos />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/teste" element={<Teste />} />
                <Route path="/authenticate" element={<LoginFormAuth />} />
                <Route path="/welcomeUser" element={<TelaUser />} />
                <Route path="/welcomeAdmin" element={<TelaAdmin />} />
                <Route path="/manterReclamacoes" element={<ManterReclamacoes />} />
                <Route path="/registrarReclamacao" element={<RegistrarReclamacao />} />
                <Route path="/registerUser" element={<RegisterFormUser />} />
                <Route path="/updateUser/:username" element={<UpdateFormUser />} />
                {/* Adicione outras rotas aqui, se necessário */}
            </Routes>
        </Router>
    );
}
 export default AppRoutes;