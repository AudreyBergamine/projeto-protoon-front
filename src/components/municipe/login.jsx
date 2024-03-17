import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//Função que excecuta o login, contendo configurações do login e o formulário HTML
function LoginForm() {
    const navigate = useNavigate();

    //Função assíncrona que lida com a parte de conexão com o backend, requerindo uma resposta do back
    const handleSubmit = async () => { 
      //TODO: É necessário configurar essa função corretamente após a construção da autenticação no back
        try {
          const response = await axios.get('https://proton-1710414195673.azurewebsites.net/municipes');
          
          console.log(response.data); 
          alert('Dados enviados com sucesso!');
        } catch (error) {
          console.error('Erro ao enviar os dados:', error);
        }
      };

  //Função responsável para redirecionar para o /cadastro page
  const handleCadastroClick = () => {
    navigate('/cadastro'); // Redireciona para a página de cadastro
  };

  //É retornado o formulário html abaixo
  return (
    <div>
      <header class="header">
        <div class="title-proton">PROTO-ON</div>
          <nav>
            <ul class="nav-links">
              <li><a href="/home">Home</a></li>
              <li>
                <a href="#">Serviços</a>
                <ul class="submenu">
                  <li><a href="#">Abrir reclamação</a></li>
                  <li><a href="#">Consultar protocolos</a></li>
                </ul>
              </li>
              <li>
                <a href="#">Mais</a>
                <ul class="submenu">
                  <li><a href="#">Contato</a></li>
                  <li><a href="#">Sobre nós</a></li>
                </ul>
              </li>
                </ul>
          </nav>
      </header>
      <div class="container">
        <label>Login:</label>
        <input type="text" />
        <label class="lbl-password">Senha:</label>
        <input type="password"/>
      <div class="container-button">
        <button type="submit" class="shadow__btn" onClick={handleSubmit}>Login</button>
        <button type="button"  class="shadow__btn" onClick={() => (window.location.href = '/home')}>Voltar</button>
      </div>
      </div>
      <footer class="footer">
        © 2024 Proto-on. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default LoginForm;
