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

  const { username } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  useEffect(() => {
    setFormData({
      ...formData,
      username: username
    });
  }, [username]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('')
    try {
      const response = await axios.get(`/protoon/municipe/municipes`);
      const users = response.data;
      const user = users.find(u => u.username === formData.username);
      if (user) {
        setRemoveLoading(false)

        setTimeout(() => {
          setRemoveLoading(true)       
          navigate(`/atualizarSenha/${formData.username}`);
        }, 3000)
      } else {
        setMessage('Email não encontrado.')
        setType('error')
      }
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
      setMessage('Erro ao Buscar email!')
      setType('error')
    }
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
            value={formData.username}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="btn-log">Enviar</button>
      <button className="btn-log" onClick={() => (window.location.href = '/login')}>Voltar</button>
      {!removeLoading && <Loading />}
      {message && <Message type={type} msg={message} />}
    </form>
  );
}

export default EmailForm;
