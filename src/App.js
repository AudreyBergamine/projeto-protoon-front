import logo from './logo.svg';
import './style/App.css';
import './style/home.css';
import './style/login.css';
import './style/cadastro.css';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import { TokenProvider } from './context/TokenContext';
//Esta função retorna todos os components/routes para serem inseridos no html (index.html na pasta public)
function App() {
  return (
    <div className="App">
      <div>
        <Header />
      </div>
      <div>
        {/* <TokenProvider> */}
          <AppRoutes />
        {/* </TokenProvider> */}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
