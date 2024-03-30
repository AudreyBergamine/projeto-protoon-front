import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

function ManterReclamacoes() {

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
    const expirationTime = jwtDecode(token).exp;
    const now = Math.floor(Date.now() / 1000);
    const tempo = expirationTime - now;
    const tempoRestante = tempo;

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
      }
    } else {
      alert('Você não tem acesso a esta Página')
      navigate('/authenticate')
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
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div>
          <h1>Reclamações</h1>

          
          <div>
            <h3>Lista de Reclamações</h3>
            <ul style={{ listStyleType: 'none', padding: 0, marginBottom: 100 }}>
              {users.map((user, index) => (
                <div><hr />
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                    <div style={{ width: 300, marginTop: 20 }}>User: {user.username}</div>
                    <div style={{ width: 300, marginTop: 20 }}>Role: {user.role ? user.role : "MUNICIPE"}</div>
                    <div>
                      {user.username !== "admin" && (
                        <button type="button" onClick={() => handleDelete(user.username)} style={{ backgroundColor: 'red', color: 'white' }}>Excluir</button>
                      )}
                    </div>
                    <div>
                      {user.username !== "admin" && (
                        <button type="button" onClick={() => navigate(`/updateUser/${user.username}`)} style={{ backgroundColor: 'blue', color: 'white' }} className="shadow__btn">Editar</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <hr />
            </ul>
            <div style={{ position: 'sticky', height: "80px", bottom: '80px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px 0', display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 100 }}>
              <div>
                {tempoRestante !== null && tempoRestante > 0 ? (
                  <p>Tempo restante do token: {tempoRestante} segundos</p>
                ) : (
                  <p>O tempo expirou, faça login novamente por favor!</p>
                )}
              <button type="button" style={{ backgroundColor: 'green' }} className="shadow__btn" onClick={() => (window.location.href = '/welcomeAdmin')}>Voltar</button>
              <button type="button" style={{ backgroundColor: 'blue' }} className="shadow__btn" onClick={() => (window.location.href = '/registerUser')}>Cadastrar uma nova Reclamação</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManterReclamacoes;
