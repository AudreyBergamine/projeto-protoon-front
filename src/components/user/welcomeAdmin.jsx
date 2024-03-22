import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function TelaAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const { username = '', password = '', role = '' } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/welcomeAdmin', {
          auth: {
            username: username,
            password: password
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErrorMessage('Você não tem autorização para ver esta página.');        
      }    
    };
    fetchData();
  }, []);

return (
  <div>
    {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <h1>Bem-vindo, {username}</h1>
      )}
    <Link to="/authenticate">Voltar</Link><br></br><br></br>
  </div>
);
}

export default TelaAdmin;
