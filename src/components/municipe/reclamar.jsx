import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../services/axiosInstance';
import moment from "moment";

//Função de cadastro de municipe
function Reclamar() {
  const navigate = useNavigate();
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
    //const hashedPassword = await bcrypt.hash(formData.senha, 10);
    try {
      const response = await axios.post('/reclamacoes', {
        // const response = await axios.post('https://proton-1710414195673.azurewebsites.net/municipes', {
        ...formData, // Inclua todos os dados do formData
        // senha: hashedPassword,
        data_nascimento: formattedDate // Substitua o campo data_nascimento formatado
      });

      console.log(response.data);
      alert('Dados enviados com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };


  //Por fim é retornado o html para ser exibido no front end, junto com as funções acima.
  return (
    <>
      <div style={{ paddingBottom: '100px' }}>
        <form onSubmit={handleSubmit}>
          <div>

            <h3>Reclame Aqui</h3>
            <div className="register-form">
              <div className="input-container">

                <div>
                  <label>Problema:</label><br />
                    <select
                    style={{ fontSize: 20, padding: 10, borderRadius: 10, textAlign: "center" }}
                      name="problema"
                      value={formData.problema}
                      onChange={handleChange}
                    >
                      <option value="">Selecione um problema</option>
                      <option value="Buraco na rua">Buraco na rua</option>
                      <option value="Vazamento de água">Vazamento de água</option>
                      <option value="Problema de iluminação">Problema de iluminação</option>
                    </select>
                </div>


              </div>
            </div>
            <hr></hr>
            <div className="register-form">
              <div className="input-container">

                <div>
                  <label>Descrição</label><br />
                  <textarea style={{ width: 600, padding: 20, borderRadius: 10 }}
                    name="descricao"
                    rows="5"
                    placeholder="Ex.: Buraco em minha rua, com risco de acidentes"
                    value={formData.descricao}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: -30 }}>
            <button type="submit" className="btn-cad" style={{ marginRight: '100px' }}>Confirmar</button>
            <button className="btn-log" onClick={() => (window.location.href = '/paginaInicial')}>Voltar</button>
          </div>
          <footer className="footer">
            © 2024 Proto-on. Todos os direitos reservados.
          </footer>
        </form>
      </div>
    </>
  );
}

export default Reclamar;
