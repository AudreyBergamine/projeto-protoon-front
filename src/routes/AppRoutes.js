import LoginForm from '../components/municipe/login';
import Home from '../components/home-page/homePage';
import RegisterForm from '../components/municipe/register';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, redirect } from 'react-router-dom';

//Esta função, adiciona todos os components (que contém o html junto com funções), para serem exibidos conforme a url inserida
function AppRoutes() {
    return (
        <Router>
            <Routes>
            <Route path="/home" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/cadastro" element={<RegisterForm />} />
                {/* Adicione outras rotas aqui, se necessário */}
            </Routes>
        </Router>
    );
}
 export default AppRoutes;