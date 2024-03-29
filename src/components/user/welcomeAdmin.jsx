import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function TelaAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState(""); // Use useState para username
  const [tempoRestante, setTempoRestante] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const usernameFromStorage = localStorage.getItem('username');

      const role = localStorage.getItem('role');
      setUsername(usernameFromStorage); // Atualize o estado de username

      if (role !== "ADMIN") {
        setErrorMessage('Você não tem autorização para ver esta página.');
      }
    };
    fetchData();

  const token = localStorage.getItem('token');
  if (typeof token === 'string') {
    const now = Math.floor(Date.now() / 1000);
    const expirationTimeInSeconds = jwtDecode(token).exp - now;

    if (expirationTimeInSeconds > 0) {
      setTempoRestante(expirationTimeInSeconds);
      const interval = setInterval(() => {
        setTempoRestante((prevTempoRestante) => prevTempoRestante - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      localStorage.removeItem('token'); // Remover o token do localStorage
      setTempoRestante(null); // Atualizar o estado do tempo restante para null
    }
  } else {
    localStorage.removeItem('token'); // Remover o token do localStorage
    setTempoRestante(null); // Atualizar o estado do tempo restante para null
    alert('Tempo de login expirou')
    navigate('/authenticate');
  }
}, []);

  return (
    <div>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div>
          <h1>Bem-vindo, {username}</h1>
          {tempoRestante !== null && tempoRestante > 0 ? (
            <p>Tempo restante do token: {tempoRestante} segundos</p>
          ) : (
            <p>O tempo expirou, faça login novamente por favor!</p>
          )}
        </div>
      )}
      <Link to="/authenticate">Voltar</Link><br></br><br></br>
    </div>
  );
}

export default TelaAdmin;
