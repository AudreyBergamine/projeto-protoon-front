import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
function RegisterForm() {
  const [formData, setFormData] = useState({
    nome_municipe: "t",
    email: "",
    senha: "",
    num_CPF: "",

    endereco: {
        tipo_endereco: "",
        num_cep: "",
        logradouro: "",
        nome_endereco: "",
        num_endereco: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: ""
      }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8080/municipes', formData);
      
      console.log(response.data);
      alert('Dados enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

 

  return (

<form onSubmit={handleSubmit}>
    <div>
      <label>Nome:</label>
      <input
        type="text"
        name="nome_municipe"
        value={formData.nome_municipe}
        onChange={handleChange}
      />
    </div>
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
    </div>
    <div>
      <label>Senha:</label>
      <input
        type="password"
        name="senha"
        value={formData.senha}
        onChange={handleChange}
      />
    </div>
    <div>
      <label>Número do CPF:</label>
      <input
        type="number"
        name="num_CPF"
        value={formData.num_CPF}
        onChange={handleChange}
      />
    </div>
     
    <div>
        <label>Tipo de endereço:</label>
        <input type="text" name="tipo_endereco" value={formData.tipo_endereco}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Número do cep:</label>
        <input type="number" name="num_cep" value={formData.num_cep}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Logradouro:</label>
        <input type="text" name="logradouro" value={formData.logradouro}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Nome Endereço:</label>
        <input type="text" name="nome_endereco" value={formData.nome_endereco}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Número do endereço:</label>
        <input type="number" name="num_endereco" value={formData.num_endereco}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Complemento:</label>
        <input type="text" name="complemento" value={formData.complemento}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Bairro:</label>
        <input type="text" name="bairro" value={formData.bairro}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Cidade:</label>
        <input type="text" name="cidade" value={formData.cidade}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>Estado:</label>
        <input type="text" name="estado" value={formData.estado}
          onChange={(handleChange)}
        />
      </div>
      <div>
        <label>País:</label>
        <input type="text" name="pais" value={formData.pais}
          onChange={(handleChange)}
        />
      </div>
      

  
      <button type="submit">Cadastrar-se</button>
    </form>
  );
}

export default RegisterForm;
