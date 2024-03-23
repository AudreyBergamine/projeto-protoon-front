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
          const response = await axios.get('http://localhost:8080/municipes');
          // const response = await axios.get('https://proton-1710414195673.azurewebsites.net/municipes');
          
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
      <div className="container">
        <label>Login:</label>
        <input type="text" />
        <label className="lbl-password">Senha:</label>
        <input type="password"/>
      <div className="container-button">
        <button type="submit" className="shadow__btn" onClick={handleSubmit}>Login</button>
        <button type="button"  className="shadow__btn" onClick={() => (window.location.href = '/')}>Voltar</button>
      </div>
      </div>
    </div>
  );
}

export default LoginForm;
