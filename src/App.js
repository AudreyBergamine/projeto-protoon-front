import './style/App.css';
import './style/home.css';
import './style/menuLogin.css';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PopupProvider } from './context/PopupContext';
import GlobalPopup from './components/layouts/GlobalPopup';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            const roleUser = localStorage.getItem("role");
            
            if (roleUser) {
                setIsAuthenticated(true);
                setRole(roleUser);
            }
            setIsLoading(false);
        };

        checkAuthentication();
    }, []);

    if (isLoading) {
        return <div></div>;
    }

    return (
        <PopupProvider>
            <Router>
                <div className="App">
                    <Header isAuthenticated={isAuthenticated} role={role} />
                    <AppRoutes isAuthenticated={isAuthenticated} role={role} />
                    <Footer />
                    <GlobalPopup />
                </div>
            </Router>
        </PopupProvider>
    );
}

export default App;