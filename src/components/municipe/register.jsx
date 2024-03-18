import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
//Função de cadastro de municipe
function RegisterForm() {
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
    
  }else{//Caso não, será atualizado o campo municipe (todos os outros campos).
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
    try {
      const response = await axios.post('https://proton-1710414195673.azurewebsites.net/municipes', {
        ...formData, // Inclua todos os dados do formData
        data_nascimento: formattedDate // Substitua o campo data_nascimento formatado
      });
      
      console.log(response.data); 
      alert('Dados enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

 
  //Por fim é retornado o html para ser exibido no front end, junto com as funções acima.
  return (

<form onSubmit={handleSubmit}>
    <div>
    <header class="header">
        <div class="title-proton">PROTO-ON</div>
          <nav>
            <ul class="nav-links">
              <li><a href="/home">Home</a></li>
              <li>
                <a href="#">Serviços</a>
                <ul class="submenu">
                  <li><a href="#">Abrir reclamação</a></li>
                  <li><a href="#">Consultar protocolos</a></li>
                </ul>
              </li>
              <li>
                <a href="#">Mais</a>
                <ul class="submenu">
                  <li><a href="#">Contato</a></li>
                  <li><a href="#">Sobre nós</a></li>
                </ul>
              </li>
                </ul>
          </nav>
      </header>
      <label>Nome:</label>
      <input
        type="text"
        name="nome_municipe"
        placeholder="Ex.: Cláudio Silva"
        value={formData.nome_municipe}
        onChange={handleChange}
      />
    </div>
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        placeholder="Ex.: claudio.silva@gmail.com"
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
        placeholder="Ex.: 33333333333"
        value={formData.num_CPF}
        onChange={handleChange}
      />
    </div>
    <div>
        <label>Data de Nascimento:</label>
        <input
          type="date"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
        />
      </div>
     
    <div>
        <label>Tipo de endereço:</label>
        <input 
          type="text" 
          name="tipo_endereco" 
          value={formData.tipo_endereco}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Número do cep:</label>
        <input 
          type="number" 
          name="num_cep" 
          placeholder="Ex.: 77777777"
          value={formData.num_cep}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Logradouro:</label>
        <input 
          type="text" 
          name="logradouro" 
          value={formData.logradouro}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Nome Endereço:</label>
        <input 
          type="text" 
          name="nome_endereco" 
          placeholder="Ex.: Casa"
          value={formData.nome_endereco}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Número do endereço:</label>
        <input 
          type="number" 
          name="num_endereco" 
          placeholder="Ex.: 1025"
          value={formData.num_endereco}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Complemento:</label>
        <input 
          type="text" 
          name="complemento" 
          placeholder="Bloco, apartamento, casa, fundos..."
          value={formData.complemento}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bairro:</label>
        <input 
          type="text" 
          name="bairro"
          placeholder="Ex.: Bairro das Flores" 
          value={formData.bairro}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cidade:</label>
        <input 
          type="text" 
          name="cidade" 
          placeholder="Ex.: Ferraz de Vasconcelos" 
          value={formData.cidade}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Estado:</label>
        <input 
          type="text" 
          name="estado" 
          placeholder="Ex.: São Paulo" 
          value={formData.estado}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>País:</label>
        <input 
          type="text" 
          name="pais" 
          placeholder="Ex.: Brasil"
          value={formData.pais}
          onChange={handleChange}
        />
      </div>
      <button type="submit" class="button-cad">Cadastrar-se</button>
      
      <footer class="footer">
        © 2024 Proto-on. Todos os direitos reservados.
      </footer>
    </form>
  );
}

export default RegisterForm;
