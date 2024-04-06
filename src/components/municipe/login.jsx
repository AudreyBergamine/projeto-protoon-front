import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/protoon/auth/', // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });

  const axiosInstance2 = axios.create({
    baseURL: 'http://localhost:8080/protoon/', // Adjust the base URL as needed
    withCredentials: true, // Ensure Axios sends cookies with requests
  });
  
  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('authenticate', {
        email: email,
        senha: senha 
      });

      // If authentication is successful, you can handle the response as needed
      console.log('Authentication successful:', response.data);

      // Optionally, you can redirect the user to another page upon successful authentication
      // history.push('/dashboard');
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication error:', error.response.data);
      setErrorMessage(error.response.data.message); // Set error message to display to the user
    }
  };

  const testLogin = async () => {
    try {
      const response = await axiosInstance2.get('/municipe/municipes');
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    testLogin();
  }, []); // Call testLogin only once when the component mounts

  return (
    <div>
      <h1>Login</h1>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default LoginForm;