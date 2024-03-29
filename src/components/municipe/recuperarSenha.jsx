import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EmailForm() {

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
    try {
      const response = await axios.get(`http://localhost:8080/users`);
      const users = response.data;
      const user = users.find(u => u.username === formData.username);
      if (user) {
        navigate(`/atualizarSenha/${formData.username}`);
      } else {
        alert("Email não encontrado. Verifique o email digitado.");
      }
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
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

      <button type="submit">Enviar</button>
      <button type="button" className="shadow__btn" onClick={() => (window.location.href = '/login')}>Voltar</button>
    </form>
  );
}

export default EmailForm;
