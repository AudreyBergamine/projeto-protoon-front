import axios from "axios";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import bcrypt from 'bcryptjs';

function UpdateFormUser() {
  const { username  } = useParams();
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
      const hashedPassword = bcrypt.hashSync(formData.password, 10);
      const response = await axios.put(`http://localhost:8080/users/${username}`, {
        username: formData.username,
        password: hashedPassword
      });
      
      console.log(response.data);
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Atualizar Usuário</h1>
      <div>
        <label>Username </label><br></br>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          readOnly // Para impedir a edição do username
        />
      </div><br></br><br></br>
      <div>
        <label>Password </label><br></br>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div><br></br><br></br>
      <button type="submit">Atualizar</button><br></br><br></br>
      <Link to="/authenticate" style={{ textDecoration: 'none'}}>Voltar</Link>
    </form>
  );
}

export default UpdateFormUser;
