import React from 'react';
import { BrowserRouter as Router, Routes, Route, redirect } from 'react-router-dom';
//MUNICIPE
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
//ADMIN
import LoginAdmin from '../components/admin/loginAdmin';
import TelaAdmin from '../components/admin/welcomeAdmin';
import Teste from '../components/admin/teste';
import TelaUser from '../components/admin/welcomeUser';
import ManterReclamacoes from '../components/admin/manterReclamacoes';
import RegistrarReclamacao from '../components/admin/registrarReclamacao';
import RegisterFormUser from '../components/admin/registerUser';
import UpdateFormUser from '../components/admin/updateUser';

//Esta função, adiciona todos os components (que contém o html junto com funções), para serem exibidos conforme a url inserida
function AppRoutes() {
    return (
        <Router>
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
                <Route path="/loginAdmin" element={<LoginAdmin />} />
                <Route path="/welcomeAdmin" element={<TelaAdmin />} />
                <Route path="/teste" element={<Teste />} />
                <Route path="/welcomeUser" element={<TelaUser />} />
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