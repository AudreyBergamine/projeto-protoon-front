// import React, { useState } from "react";
// import axios from '../services/axiosInstance';
/*
function RegistrarReclamacao() {
  const [role, setRole] = useState("MUNICIPE"); //Seta o radio Button paa Municipe
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "MUNICIPE"
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") { //Escuta radio button
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

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const hashedPassword = bcrypt.hashSync(formData.password, 10);
    axios.post("/users", {
      username: formData.username,
      password: hashedPassword,
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
      <h1>Cadastro de Reclamação</h1>
      <div className="input-container">
        <div className="input-container">
          <label style={{ marginBottom: -10 }}>Problema </label><br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="input-container">
        <div className="input-container">
          <label style={{ marginBottom: -10 }}>Bairro </label><br />
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit">Confirmar</button>
      <button type="button" style={{ backgroundColor: 'blue' }} className="shadow__btn" onClick={() => (window.location.href = '/manterReclamacoes')}>Voltar</button>
    </form>
  );
}

export default RegistrarReclamacao;

*/