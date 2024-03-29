import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import updateUser from "./api";

function UpdateFormUser() {
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
      await updateUser(username, formData);
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      // O erro será tratado pela função updateUser
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Atualizar Usuário</h1>
      <div className="input-container">
        <div className="input-container">
          <label>Username </label><br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div>
          <label>Password </label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit">Atualizar</button>
      <button type="button" style={{ backgroundColor: 'blue' }} className="shadow__btn" onClick={() => (window.location.href = '/welcomeAdmin')}>Voltar</button>
    </form>
  );
}

export default UpdateFormUser;
