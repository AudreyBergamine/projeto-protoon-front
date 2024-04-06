import logo from './logo.svg';
import './style/App.css';
import './style/home.css';
import './style/login.css';
import './style/cadastro.css';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import { useState, useEffect  } from 'react';
import axios from "axios";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';

function App() {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/protoon/auth/', // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de loading, para impedir que AppRoutes carregue primeiro que isAuthenticated

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axiosInstance('esta-logado');
        setIsAuthenticated(response.data);
        setIsLoading(false); // Update loading state depois da checagem de  autenticação
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoading(false); // Atualiza loading state mesmo após um error
      }
    };

    checkAuthentication();
  }, []);

  // Renderiza loading state enquanto checa a autenticação
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Renderiza rotas only when authentication check is complete
  return (
    <Router>
      <div className="App">
        <Header />
        {isAuthenticated && <AppRoutes isAuthenticated={isAuthenticated} />}
        <Footer />
      </div>
    </Router>
  );
}

export default App;