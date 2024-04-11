import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Loading from '../layouts/Loading';
import Message from '../layouts/Message'

const LoginForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState()
  const [type, setType] = useState()
  const [removeLoading, setRemoveLoading] = useState(true)

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/protoon/auth/', // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });
  console.log('IdMunicipe: ', sessionStorage.getItem("idMunicipe"));

  const axiosInstance2 = axios.create({
    baseURL: 'http://localhost:8080/protoon/', // Adjust the base URL as needed
    withCredentials: true, // Ensure Axios sends cookies with requests
  });

  const handleLogin = async () => {
    setMessage('')
    try {      
      const response = await axiosInstance.post('authenticate', {
        email: email,
        senha: senha
      });

      setRemoveLoading(false)

      setTimeout(() => {
        console.log('Authentication successful:', response.data);
        // If authentication is successful, you can handle the response as needed
        setRemoveLoading(true)
        navigate('/paginaInicial')        
      }, 3000)

      // Optionally, you can redirect the user to another page upon successful authentication
      // history.push('/dashboard');
    } catch (error) {
      // Handle authentication errors
      console.error('Authentication error:', error.response.data);
      setErrorMessage(error.response.data.message); // Set error message to display to the user
      setMessage('Erro ao fazer Login!')
      setType('error')
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
      <Link to='/recuperarSenha' style={{ textDecoration: 'none' }}>Esqueceu a Senha?</Link>
      <div style={{ marginBottom: 30 }}>
        <button onClick={handleLogin} className="btn-cad" style={{ marginRight: '100px' }}>Logar</button>
        <button className="btn-log" onClick={() => (window.location.href = '/cadastro')}>Criar Conta</button>
      </div>
      {message && <Message type={type} msg={message} />}
      {errorMessage && <p>{errorMessage}</p>}
      {!removeLoading && <Loading />}
    </div>
  );
};

export default LoginForm;