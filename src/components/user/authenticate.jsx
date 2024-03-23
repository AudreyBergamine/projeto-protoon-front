import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from 'bcryptjs';

function LoginFormAuth() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const checkPassword = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/users', {
        auth: {
          username: "teste",//Permissão para fazer a busca
          password: "teste"
        }
      });
      const users = response.data;
      const user = users.find(u => u.username === username);
      if (user) { 
        if (checkPassword(password, user.password)) {
          console.log('Login bem-sucedido!');
          alert('Login bem-sucedido!');
          const role = user.role
          if (role === 'ADMIN') {
            const response = await axios.get('http://localhost:8080/welcomeAdmin', {
              auth: {
                username: username,
                password: password
              }
            });
            if (response) {
              navigate('/welcomeAdmin', { state: { username, password, role } });              
            }
          } else {
            const response = await axios.get('http://localhost:8080/welcomeUser', {
              auth: { 
                username: username,
                password: password
              }
            });
            if (response) {
              navigate('/welcomeUser', { state: { username, password, role } }); 
            }
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

  useEffect(() => { //Aqui é para listar os usuários na tela de Login para teste
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (username) => {
    try {
      if (window.confirm('Tem certeza que deseja remover este usuário?')) {
          await axios.delete(`http://localhost:8080/users/${username}`);// Para deletar do banco de dados
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
        <div>
          <label>Username </label><br></br>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          /><br></br><br></br>
        </div>
        <div>
          <label>Password </label><br></br>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br></br>
        </div><br></br>
        <button type="submit">Login</button>
        <br />
        <br />
        <Link to="/registerUser">cadastre-se</Link>
      </form>      
      <div>
        <h3>Lista de Usuários</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map((user, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          
            <div>User: {user.username}</div>
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
        </ul>
      </div>
    </div>
  );
}

export default LoginFormAuth;
