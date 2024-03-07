import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function LoginForm() {
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
          const response = await axios.get('http://localhost:8080/municipes');
          
          console.log(response.data);
          alert('Dados enviados com sucesso!');
        } catch (error) {
          console.error('Erro ao enviar os dados:', error);
        }
      };

  const handleCadastroClick = () => {
    navigate('/cadastro'); // Redireciona para a página de cadastro
  };

  return (
    <div>
      <div>
        <label>Username:</label>
        <input type="text" />
      </div>
      <div>
        <label>Password:</label>
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
