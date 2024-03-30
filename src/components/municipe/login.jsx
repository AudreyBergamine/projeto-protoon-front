import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';

//Função que excecuta o login, contendo configurações do login e o formulário HTML
function LoginForm() {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const checkPassword = async (plainPassword, hashedPassword) => {//Método Hash
    
    return await bcrypt.compareSync(plainPassword, hashedPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/municipes');//Buscando usuarios
      const municipes = response.data;
      console.log(response.data)
      const municipe = municipes.find(u => u.email === email);
      if (municipe) {
        console.log(senha);
        console.log(municipe.senha);
        console.log(await bcrypt.compare(senha, municipe.senha));
        if (checkPassword(senha, municipe.senha)) {
          console.log('Login bem-sucedido!');
          alert('Login bem-sucedido!');
          const username = email;
          const password = senha;
          const loginResponse = await axios.get('http://localhost:8080/authenticate', {//Obtendo Token
            auth: {
              username: email,
              password: senha
            }
          });

          let token = loginResponse.data;
          console.log("Token: " + token);
          const role = jwtDecode(token).scope.split('_').pop().toUpperCase();//Pegando a role do token

          // console.log(role);

          localStorage.setItem('role', role);
          localStorage.setItem('token', token);

          token = localStorage.getItem('token');

  const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

          if (role === "ADMIN") {
            navigate('/paginaInicial');

          } else if (role === "MUNICIPE") {
            navigate('/', { state: { email, senha, role, token } });
          }
        } else {
          alert('Senha Inválida!');
        }
      } else {
        alert('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={handleSubmit} style={{ marginTop: -100 }}>
          <div className="input-container">
            <div className="input-container">
              <label style={{ marginBottom: 15 }}>Email:</label>
              <input type="text" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
              <label className="lbl-password" style={{ marginBottom: 15 }}>Senha:</label>
              <input type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required /><br></br>
            </div>
          </div>
          <Link to="/recuperarSenha">Esqueceu a senha Clique Aqui!</Link><br></br><br></br>
        <div className="container-button">
            <button type="submit" className="shadow__btn">Login</button>
            <button type="button" style={{ backgroundColor: 'blue' }} className="shadow__btn" onClick={() => (window.location.href = '/cadastro')}>Cadastre-se</button>
            <button type="button" className="shadow__btn" onClick={() => (window.location.href = '/home')}>Voltar</button>
          {/* Esta div ta buagada */}
          <div className="container"></div>
        </div>
        </form>
      </div>
      <div>

      </div>
      <footer className="footer">
        © 2024 Proto-on. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default LoginForm;
