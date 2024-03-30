import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';
// import { useToken } from '../../context/TokenContext';
import axiosInstance from '../../services/axiosInstance';

function LoginFormAuth() {

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

  const checkPassword = (plainPassword, hashedPassword) => {//Método Hash
    return bcrypt.compareSync(plainPassword, hashedPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.get('http://localhost:8080/users')//Buscando usuarios
    .then((response) => {

    const users = response.data;
    const user = users.find(u => u.username === username);
    if (user) {
      if (checkPassword(password, user.password)) {
        console.log('Login bem-sucedido!');
        alert('Login bem-sucedido!');

        const loginResponse = axios.get('http://localhost:8080/authenticate', { // Obtendo Token
          auth: {
            username: username,
            password: password
          }
        })
          .then((loginResponse) => {
            const token = loginResponse.data;
            // console.log("Token: " + token);

            const expirationTime = jwtDecode(token).exp; // Tempo de expiração em segundos
            const now = Math.floor(Date.now() / 1000);
            const tempo = expirationTime - now;
            setTempoRestante(tempo);
            console.log(tempoRestante)

            const role = jwtDecode(token).scope.split('_').pop().toUpperCase();//Pegando a role do token

            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
            localStorage.setItem('tempo', tempo);
            localStorage.setItem('token', token);

            if (role === "ADMIN") {
              navigate('/welcomeAdmin');

            } else if (role === "MUNICIPE") {
              navigate('/teste');
            }
          })
          .catch((error) => {
            console.log(error)
          })

      } else {
        alert('Senha Inválida!');
      }
    } else {
      alert('Usuário não encontrado');
    }
  })
  .catch((error => {
    console.log(error)
  }))
  }
  useEffect(() => {
    setUsername("");
    setPassword("");
    setRole("");
    console.log('Role: ', role)
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users");
        setUsers(response.data);

        if (role !== "ADMIN") {
          setErrorMessage('Você não tem autorização para ver esta página.');
        }
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };

    fetchData();

    const expirationTimeInSeconds = localStorage.getItem('tempo');
    if (expirationTimeInSeconds > 0) {
      setTempoRestante(expirationTimeInSeconds);
      const interval = setInterval(() => {
        setTempoRestante((prevTempoRestante) => prevTempoRestante - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

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
      <button type="button" style={{ backgroundColor: 'blue', marginBottom: 100 }} className="shadow__btn" onClick={() => (window.location.href = '/authenticate')}>Voltar</button>
    </div>
  );
}

export default LoginFormAuth;
