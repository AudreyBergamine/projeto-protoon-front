import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// import moment from "moment";
import Loading from '../layouts/Loading';
import Message from '../layouts/Message'

//Função de cadastro de municipe
function Reclamar() {
  const navigate = useNavigate();
  const [message, setMessage] = useState()
  const [type, setType] = useState()
  const [removeLoading, setRemoveLoading] = useState(true)
  //Este campo abaixo é um objeto em json que é enviado ao backend para requisitar o cadastro!
  const [formData, setFormData] = useState({
    assunto: "",
    descricao: ""
  });


  //Esta função tem o propósito de inserir valores nos dados acima, que estão vázios.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //A função abaixo lida com a conexão com o backend e a requisição de cadastrar um municipe.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/protoon/protocolo/abrir-protocolos', {
        assunto: formData.assunto,
        descricao: formData.descricao,
        id_municipe: 1
      });

      setRemoveLoading(false)
      setTimeout(() => {
        console.log(response.data);
        setRemoveLoading(true)
        setMessage('Reclamação bem sucedida! Redirecionando...')
        setType('success')
        setTimeout(() => {
          navigate('/paginaInicial');
        }, 3000)
      }, 3000)
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
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                  >
                    <option value="">Selecione um problema</option>
                    <option value="Buraco na rua">Buraco na rua</option>
                    <option value="Vazamento de água">Vazamento de água</option>
                    <option value="Problema de iluminação">Problema de iluminação</option>
                  </select>
                </div>
              </div>
            </div><br />
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
            <button className="btn-log" onClick={() => (window.location.href = '/')}>Voltar</button>
          </div>
          {!removeLoading && <Loading />}
          {message && <Message type={type} msg={message} />}
        </form>
      </div>
    </>
  );
}

export default Reclamar;
