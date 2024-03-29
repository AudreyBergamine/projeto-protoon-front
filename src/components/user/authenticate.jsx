import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from 'bcryptjs';
import { jwtDecode } from 'jwt-decode';
// import { useToken } from '../../context/TokenContext';
import axiosInstance from '../../services/axiosInstance';

function LoginFormAuth() {

  const navigate = useNavigate();
  const [ tempoRestante, setTempoRestante ] = useState(null);
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
    try {

      const response = await axiosInstance.get('/users');//Buscando usuarios
      const users = response.data;
      const user = users.find(u => u.username === username);
      if (user) {
        if (checkPassword(password, user.password)) {
          console.log('Login bem-sucedido!');
          alert('Login bem-sucedido!');

          const loginResponse = await axios.get('http://localhost:8080/authenticate', { // Obtendo Token
            auth: {
              username: user.username,
              password: password
            }
          });

          const token = loginResponse.data;
          // console.log("Token: " + token);

          const expirationTime = jwtDecode(token).expirationTimeInSeconds; // Tempo de expiração em segundos
          setTempoRestante(expirationTime);

          const role = jwtDecode(token).scope.split('_').pop().toUpperCase();//Pegando a role do token

          localStorage.setItem('role', role);
          localStorage.setItem('username', username);
          localStorage.setItem('tempo', expirationTime);
          localStorage.setItem('token', token);

          if (role === "ADMIN") {
            navigate('/welcomeAdmin');

          } else if (role === "MUNICIPE") {
            navigate('/teste');
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
    };

  }
  useEffect(() => {
    setUsername(null);
    setPassword(null);
    setRole(null);
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users");
        setUsers(response.data);
        const usernameFromStorage = localStorage.getItem('username');
        const role = localStorage.getItem('role');
  
        if (usernameFromStorage) {
          setUsername(usernameFromStorage);
        }
  
        if (role !== "ADMIN") {
          console.log("Role: ", role)
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
  


  const handleDelete = async (username) => {
    try {
      if (window.confirm('Tem certeza que deseja remover este usuário?')) {
        await axios.delete(`http://localhost:8080/users/${username}`);// Para deletar usuario do banco de dados
        setUsers(users.filter(user => user.username !== username));
        alert('Usuário deletado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
      alert('Erro ao deletar o usuário. Por favor, tente novamente.');
    }
  };

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
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) :
        <div>
          <Link to="/registerUser">cadastrar um Usuário</Link>
          <div>
            <h3>Lista de Usuários</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {users.map((user, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>

                  <div style={{ width: 300 }}>User: {user.username}</div>
                  <div>Role: {user.role ? user.role : "MUNICIPE"}</div>
                  <div>
                    {user.username !== "admin" && (
                      <button onClick={() => handleDelete(user.username)}>Excluir</button>
                    )}
                  </div>
                  <div>
                    {user.username !== "admin" && (
                      <button onClick={() => navigate(`/updateUser/${user.username}`)}>Editar</button>
                    )}
                  </div>
                </div>
              ))}
              <Link to="/home" style={{ marginBottom: 100 }}>Voltar</Link><br></br><br></br>
            </ul>
          </div>
        </div>}
    </div>
  );
}

export default LoginFormAuth;
