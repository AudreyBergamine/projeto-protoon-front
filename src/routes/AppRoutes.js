import LoginForm from '../components/municipe/login';
import Home from '../components/home-page/homePage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, redirect } from 'react-router-dom';
function AppRoutes() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                {/* Adicione outras rotas aqui, se necessário */}
            </Routes>
        </Router>
    );
}
 export default AppRoutes;