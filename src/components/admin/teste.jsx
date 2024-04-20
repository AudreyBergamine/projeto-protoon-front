import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

function Teste() {
  // const location = useLocation();
  // const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState(""); // Use useState para username
  const [tempoRestante, setTempoRestante] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    console.log(role)
    const fetchData = async () => {
      const usernameFromStorage = localStorage.getItem('username');

      setUsername(usernameFromStorage); // Atualize o estado de username

      if (role !== "MUNICIPE") {
        setErrorMessage('Você não tem autorização para ver esta página.');
      }
    };
    fetchData();
    const expirationTimeInSeconds = 100 ;

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

export default Teste;
