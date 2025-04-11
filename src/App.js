import './style/App.css';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layouts/Header/Header';
import Footer from './components/layouts/Footer/Footer';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('')
    const [isLoading, setIsLoading] = useState(true); // Estado de loading, para impedir que AppRoutes carregue primeiro que isAuthenticated

    useEffect(() => {
        const checkAuthentication = async () => {
            const roleUser = localStorage.getItem("role")

            if (roleUser) {

                setIsAuthenticated(true);
                setRole(roleUser)
                setIsLoading(false); // Update loading state depois da checagem de  autenticação
                return true;
            } else {
                setIsLoading(false); // Atualiza loading state mesmo após um error
                return false;
            }
        };

        checkAuthentication();
    }, [setIsAuthenticated, setRole, setIsLoading]);

    // Renderiza loading state enquanto checa a autenticação
    if (isLoading) {
        return <div></div>;
    }

    // Renderiza rotas quando authentication for true
    return (
        <Router>
            <div className="App">
                <Header isAuthenticated={isAuthenticated} role={role} />
                {<AppRoutes isAuthenticated={isAuthenticated} role={role} />}
                <Footer />
            </div>
        </Router>
    );
}

export default App;