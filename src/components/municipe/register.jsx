import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../services/axiosInstance';
import moment from "moment";
import bcrypt from 'bcryptjs';

//Função de cadastro de municipe
function RegisterForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //Este campo abaixo é um objeto em json que é enviado ao backend para requisitar o cadastro!
  const [formData, setFormData] = useState({
    nome_municipe: "",
    email: "",
    senha: "",
    num_CPF: "",
    data_nascimento: "",
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

  //Esta função tem o propósito de inserir valores nos dados acima, que estão vázios.
  const handleChange = (e) => {
    //A lista abaixo contém o nome de todos os campos que há em endereço
    const enderecoFields = ['tipo_endereco', 'num_cep', 'logradouro', 'nome_endereco', 'num_endereco', 'complemento', 'bairro', 'cidade', 'estado', 'pais'];

    const { name, value } = e.target;

    if (enderecoFields.includes(name)) {//Caso em um formulário contenha algum nome da lista, então será alterado o valor do objeto endereco
      setFormData({
        ...formData,
        endereco: {
          ...formData.endereco,
          [name]: value
        }
      });

    } else {//Caso não, será atualizado o campo municipe (todos os outros campos).
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  //A função abaixo lida com a conexão com o backend e a requisição de cadastrar um municipe.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = moment(formData.data_nascimento).format('YYYY-MM-DD');
    const hashedPassword = await bcrypt.hash(formData.senha, 10);

    const response = await axios.post('/municipes', {
      // const response = await axios.post('https://proton-1710414195673.azurewebsites.net/municipes', {
      ...formData, // Inclua todos os dados do formData
      senha: hashedPassword,
      data_nascimento: formattedDate // Substitua o campo data_nascimento formatado
    })
      .then((response) => {        
        console.log(response.data);
        alert('Dados enviados com sucesso!');
        navigate('/login');
      })
  .catch((error) => {
    console.error('Erro na Request localhost:8080/municipes');  
});
  }


//Por fim é retornado o html para ser exibido no front end, junto com as funções acima.
return (

  <form onSubmit={handleSubmit}>
    <div>

      <h3>Dados Pessoais</h3>
      <div className="register-form">
        <div className="input-container">

          <div>
            <label>Nome:</label><br></br>
            <input
              type="text"
              name="nome_municipe"
              placeholder="Ex.: Cláudio Silva"
              value={formData.nome_municipe}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email:</label><br></br>
            <input
              type="email"
              name="email"
              placeholder="Ex.: claudio.silva@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Senha:</label><br></br>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Número do CPF:</label><br></br>
            <input
              type="number"
              name="num_CPF"
              placeholder="Ex.: 33333333333"
              value={formData.num_CPF}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Data de Nascimento:</label><br></br>
            <input
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>
      <hr></hr>
      <h3>Endereço</h3>
      <div className="register-form">
        <div className="input-container">

          <div>
            <label>Número do cep:</label><br></br>
            <input
              type="number"
              name="num_cep"
              placeholder="Ex.: 77777777"
              value={formData.num_cep ? formData.num_cep : "100"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Logradouro:</label><br></br>
            <input
              type="text"
              name="logradouro"
              placeholder="Ex.: Rua das Flores"
              value={formData.logradouro ? formData.logradouro : "Rua das Flores"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Nome Endereço:</label><br></br>
            <input
              type="text"
              name="nome_endereco"
              placeholder="Ex.: Casa"
              value={formData.nome_endereco ? formData.nome_endereco : "Casa"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Número do endereço:</label><br></br>
            <input
              type="number"
              name="num_endereco"
              placeholder="Ex.: 1025"
              value={formData.num_endereco ? formData.num_endereco : "10"}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Complemento:</label><br></br>
            <input
              type="text"
              name="complemento"
              placeholder="Bloco, apartamento, casa, fundos..."
              value={formData.complemento ? formData.complemento : "casa 01"}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>

      <div className="register-form">
        <div className="input-container">

          <div>
            <label>Tipo de endereço:</label><br></br>
            <input
              type="text"
              name="tipo_endereco"
              placeholder="Ex.: casa, apartamento"
              value={formData.tipo_endereco ? formData.tipo_endereco : "casa"}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Bairro:</label><br></br>
            <input
              type="text"
              name="bairro"
              placeholder="Ex.: Bairro das Flores"
              value={formData.bairro ? formData.bairro : "Jd Brasil"}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Cidade:</label><br></br>
            <input
              type="text"
              name="cidade"
              placeholder="Ex.: Ferraz de Vasconcelos"
              value={formData.cidade ? formData.cidade : "Ferraz de Vasconcelos"}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Estado:</label><br></br>
            <input
              type="text"
              name="estado"
              placeholder="Ex.: São Paulo"
              value={formData.estado ? formData.estado : "São Paulo"}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>País:</label><br></br>
            <input
              type="text"
              name="pais"
              placeholder="Ex.: Brasil"
              value={formData.pais ? formData.pais : "Brasil"}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
    <div style={{ marginTop: -30 }}>
      <button type="submit" className="button-cad">Cadastrar-se</button>
      <button type="button" style={{ backgroundColor: 'blue' }} className="shadow__btn" onClick={() => (window.location.href = '/login')}>Voltar</button>
    </div>
    <footer className="footer">
      © 2024 Proto-on. Todos os direitos reservados.
    </footer>
  </form>
);
}

export default RegisterForm;
