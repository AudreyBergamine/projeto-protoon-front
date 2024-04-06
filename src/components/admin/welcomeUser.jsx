import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

function TelaUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState(""); // Use useState para username

  useEffect(() => {
    const fetchData = async () => {
      const usernameFromStorage = localStorage.getItem('username'); 

      const role = localStorage.getItem('role');
      setUsername(usernameFromStorage); // Atualize o estado de username

        if (role !== "MUNICIPE") {
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
    <Link to="/login">Voltar</Link><br></br><br></br>
  </div>
);
}

export default TelaUser;
