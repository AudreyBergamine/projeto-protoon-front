import React, { useState, useEffect } from "react";
import axios from '../services/axiosInstance';
import { useNavigate, Link } from "react-router-dom";
/*
function LoginAdmin() {

  const navigate = useNavigate();
  const [tempoRestante, setTempoRestante] = useState(null);
  const [usernameFromStorage, setUsernameFromStorage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.get('/users')//Buscando usuarios
      .then(async (response) => {
        const users = response.data;
        const user = users.find(u => u.username === username);
        console.log(response.data);
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {                       
            console.log('Login bem-sucedido!');
            alert('Login bem-sucedido!');
            setTempoRestante(100);
            console.log(tempoRestante)

            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
            localStorage.setItem('tempo', tempoRestante);
            navigate('/welcomeAdmin');  
          } else {
            alert('Senha Inválida!');           
          }
        } else {
          alert('Usuário não encontrado');
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar os usuários:', error);
        alert('Erro ao buscar os usuários. Verifique sua conexão com a internet.');
      })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-container">
          <div className="input-container">
            <label>Username </label><br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password </label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit">Login de Administrador</button>
        <br />
        <br />
      </form>
      <button type="button" style={{ backgroundColor: 'blue', marginBottom: 100 }} className="shadow__btn" onClick={() => (window.location.href = '/')}>Voltar</button>
    </div>
  );
}

export default LoginAdmin;
*/