import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../services/axiosInstance';
import Loading from '../layouts/Loading';
import Message from '../layouts/Message'

function EmailForm() {
  const [message, setMessage] = useState()
  const [type, setType] = useState()
  const [removeLoading, setRemoveLoading] = useState(true)
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    username: ""
  });

  useEffect(() => {
    setFormData({
      ...formData,
      username: username
    });
  }, [username]);

  const close = () => {
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('')

    if (!username) {
      setMessage('Por favor, preencha o email!')
      setType('error')
      return
    }

    if (!isValidEmail(username)) {
      setMessage('Por favor, insira um email válido!')
      setType('error')
      return
    }

    try {
      const response = await axios.get(`/protoon/municipe/municipes`);
      const users = response.data;
      const user = users.find(u => u.username === formData.username);
      setRemoveLoading(false)
      if (user) {

        setTimeout(() => {
          setRemoveLoading(true)
          navigate(`/atualizarSenha/${formData.username}`);
        }, 3000)
      } else {
        setTimeout(() => {
          setRemoveLoading(true)
          setMessage('Email não encontrado.')
          setType('error')
        }, 3000)
      }
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
      setMessage('Erro ao Buscar email!')
      setType('error')
    }
  };

  const isValidEmail = (username) => {
    // Expressão regular para verificar se o email é válido
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Digite Seu email para recuperação de Senha</h1>
      <div className="input-container">
        <div className="input-container">
          <label style={{ marginBottom: 15 }}>Email </label>
          <input
            type="text"
            name="username"
            placeholder="Insira o email cadastrado"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn-log">Enviar</button>
      <button className="btn-log" onClick={() => (window.location.href = '/login')}>Voltar</button>
      {!removeLoading && <Loading />}
      {message && <Message type={type} msg={message} onClose={close()} />}
    </form>
  );
}

export default EmailForm;
