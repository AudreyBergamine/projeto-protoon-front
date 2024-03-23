import logo from './logo.svg';
import './style/App.css';
import './style/home.css';
import './style/login.css';
import './style/cadastro.css';
import AppRoutes from './routes/AppRoutes';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
//Esta função retorna todos os components/routes para serem inseridos no html (index.html na pasta public)
function App() {
  return (
    <div className="App">
      <div>
      <Header />
      </div>
        <div>
            <AppRoutes />
        </div>
        <div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
