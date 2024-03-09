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
      <div>
        <label>Login:</label>
        <input type="text" />
      </div>
      <div>
        <label>Senha:</label>
        <input type="password" />
      </div>
      <button type="submit" onClick={handleSubmit} >Login</button>
      <button type="button" onClick={handleCadastroClick}>
        Cadastrar-se
      </button>
      </div>
  );
}

export default LoginForm;
