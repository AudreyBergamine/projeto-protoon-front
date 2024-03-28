import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import bcrypt from 'bcryptjs';

function RegisterFormUser() {
  const [role, setRole] = useState("MUNICIPE"); //Seta o radio Button paa Municipe
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "MUNICIPE"
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") { //Escuta radio button
      console.log(role); 
      setRole(value);
      setFormData({
        ...formData,
        role: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
        axios.post("http://localhost:8080/users", {
          username: formData.username,
          password: formData.password,
          role: formData.role ? formData.role : "MUNICIPE"
        }).then(response => {
          console.log(response.data);
          alert("Dados enviados com sucesso!");
        }).catch(error => {
          console.error("Erro ao enviar os dados:", error);
        });
      
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Cadastro</h1>
      <div><br></br><br></br>
        <label>Username </label><br></br>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div><br></br><br></br>
        <label>Password </label><br></br>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />        
      </div><br></br><br></br>
      <div>
        <label>Role:</label><br />
        <label>
          <input
            type="radio"
            name="role"
            value="MUNICIPE"
            checked={role === "MUNICIPE"}
            onChange={handleChange}
          /> Municipe
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="ADMIN"
            checked={role === "ADMIN"}
            onChange={handleChange}
          /> Admin
        </label><br /><br /><br />
      </div>
      <button type="submit">Cadastrar-se</button><br></br><br></br>
      <Link to="/authenticate">Voltar</Link>
    </form>
  );
}

export default RegisterFormUser;

