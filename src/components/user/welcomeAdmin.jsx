import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import axiosInstance from '../../services/axiosInstance';

function TelaAdmin() {

  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState("");
  const [tempoRestante, setTempoRestante] = useState(null);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users");
        setUsers(response.data);

        const role = localStorage.getItem('role');
        if (role !== "ADMIN") {
          setErrorMessage('Você não tem autorização para ver esta página.');
        }
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };
    fetchData();

    const token = localStorage.getItem('token');
    const tempoRestante = localStorage.getItem('tempo');

    if (typeof token === 'string') {
      console.log('Role: ', role)
      console.log('tempoRestante: ', tempoRestante)
      if (tempoRestante > 0) {
        setTempoRestante(tempoRestante);
        const interval = setInterval(() => {
          setTempoRestante((prevTempoRestante) => {
            if (prevTempoRestante === 0) {
              clearInterval(interval);
              localStorage.removeItem('token');
              setTempoRestante(null);
              alert('Tempo de login expirou');
              navigate('/authenticate');
              return prevTempoRestante;
            }
            return prevTempoRestante - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      // } else {
      //   localStorage.removeItem('token');
      //   setTempoRestante(null);
      //   alert('Tempo de login expirou')
        // navigate('/authenticate');
      }
    } else {
      alert('Você não tem acesso a esta Página')
      navigate('/authenticate')
    }

  }, []);

  const handleDelete = async (username) => {
    // Lógica para deletar usuário
  }

  return (
    <div>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div>
          <h1>Bem-Vindo, {username}</h1>
          <div>
            {tempoRestante !== null && tempoRestante > 0 ? (
              <p>Tempo restante do token: {tempoRestante} segundos</p>
            ) : (
              <p>O tempo expirou, faça login novamente por favor!</p>
            )}
          </div>
          <Link to="/registerUser">Cadastrar um Novo Usuário</Link>
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
              <button type="button" style={{ backgroundColor: 'blue', marginBottom: 100 }} className="shadow__btn" onClick={() => (window.location.href = '/authenticate')}>Voltar</button>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TelaAdmin;
