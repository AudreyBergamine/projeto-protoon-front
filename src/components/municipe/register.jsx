import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { setEndereco } from "../services/formsComplete";
import SetCelular from "../services/setCelular";
import SetCPF from "../services/setCPF";
import SetCEP from "../services/setCEP";

//Função de cadastro de municipe
function RegisterForm() {
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/protoon/auth/', // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });
  //Este campo abaixo é um objeto em json que é enviado ao backend para requisitar o cadastro!
  const [formData, setFormData] = useState({
    nome: "",
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

  useEffect(() => {
    setEndereco('num_cep')
  }, []);

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

  const handleEnderecoChange = (logradouro, bairro, cidade, estado) => {
    setFormData({
        ...formData,
        endereco: {
            ...formData.endereco,
            logradouro,
            bairro,
            cidade,
            estado
        }
    });
};

  //A função abaixo lida com a conexão com o backend e a requisição de cadastrar um municipe.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = moment(formData.data_nascimento).format('YYYY-MM-DD');
    try {
      const response = await axiosInstance.post('register/municipe', {
        ...formData, // Inclua todos os dados do formData
        data_nascimento: formattedDate, // Substitua o campo data_nascimento formatado

      });

      console.log(response.data);
      sessionStorage.setItem("idMunicipe", response.data.id);
      alert('Dados enviados com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };


  //Por fim é retornado o html para ser exibido no front end, junto com as funções acima.
  return (

    <form onSubmit={handleSubmit}>
      <div style={{ paddingBottom: '100px' }}>

        <h3>Dados Pessoais</h3>
        <div className="register-form">
          <div className="input-container">

            <div>
              <label>Nome:</label><br></br>
              <input
                type="text"
                name="nome"
                placeholder="Ex.: Cláudio Silva"
                value={formData.nome}
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
          </div>

          <div className="input-container">
            <div>
              <label>Número do CPF:</label><br></br>
              <SetCPF />
            </div>

            <div>
              <label>Celular:</label><br></br>
              <SetCelular />
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
              <SetCEP onEnderecoChange={handleEnderecoChange} />
            </div>

            <div>
              <label>Logradouro:</label><br></br>
              <input
                type="text"
                name="logradouro"
                placeholder="Ex.: Rua das Flores"
                value={formData.endereco.logradouro}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Nome Endereço:</label><br></br>
              <input
                type="text"
                name="nome_endereco"
                placeholder="Ex.: Casa"
                value={formData.endereco.nome_endereco}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Número do endereço:</label><br></br>
              <input
                type="number"
                name="num_endereco"
                placeholder="Ex.: 1025"
                value={formData.endereco.num_endereco}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Complemento:</label><br></br>
              <input
                type="text"
                name="complemento"
                placeholder="Bloco, apartamento, casa, fundos..."
                value={formData.endereco.complemento}
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
                value={formData.endereco.tipo_endereco}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Bairro:</label><br></br>
              <input
                type="text"
                name="bairro"
                placeholder="Ex.: Bairro das Flores"
                value={formData.endereco.bairro}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Cidade:</label><br></br>
              <input
                type="text"
                name="cidade"
                placeholder="Ex.: Ferraz de Vasconcelos"
                value={formData.endereco.cidade}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Estado:</label><br></br>
              <input
                type="text"
                name="estado"
                placeholder="Ex.: São Paulo"
                value={formData.endereco.estado}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>País:</label><br></br>
              <input
                type="text"
                name="pais"
                placeholder="Ex.: Brasil"
                value={formData.endereco.pais}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      <div style={{ marginTop: -30 }}>
        <button type="submit" className="btn-cad" style={{ marginRight: '100px' }}>Cadastrar-se</button>
        <button className="btn-log" onClick={() => (window.location.href = '/login')}>Voltar</button>
      </div>
      </div>
      <footer className="footer">
        © 2024 Proto-on. Todos os direitos reservados.
      </footer>
    </form>
  );
}

export default RegisterForm;
