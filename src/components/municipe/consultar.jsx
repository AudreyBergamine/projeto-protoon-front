import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import moment from "moment";
import Loading from '../layouts/Loading';
import Message from '../layouts/Message'
import { format } from 'date-fns';

function Consultar() {
  const navigate = useNavigate();
  const [message, setMessage] = useState()
  const [type, setType] = useState()
  const [removeLoading, setRemoveLoading] = useState(true)
  const [protocolos, setProtocolos] = useState([])
  const [mostrarTabela, setMostrarTabela] = useState(false);
  //Este campo abaixo é um objeto em json que é enviado ao backend para requisitar o cadastro!
  const [formData, setFormData] = useState({
    assunto: "",
    descricao: ""
  });


  //Esta função tem o propósito de inserir valores nos dados acima, que estão vázios.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //A função abaixo lida com a conexão com o backend e a requisição de cadastrar um municipe.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:8080/protoon/protocolo')
      setProtocolos(response.data)
      setMostrarTabela(true)


      // setRemoveLoading(false)
      // setTimeout(() => {
      //   console.log(response.data);
      //   setRemoveLoading(true)
      //   setMessage('Reclamação bem sucedida! Redirecionando...')
      //   setType('success')
      //   setTimeout(() => {
      //     navigate('/paginaInicial');
      //   }, 3000)
      // }, 3000)
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
    protocolos.forEach((protocolo) => {
      console.log(protocolo.assunto);
    });
  };

  return (
    <>
    {mostrarTabela && (
      <table style={{ marginTop: 20, borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Assunto</th>
            <th>Descrição</th>
            <th>Departamento</th>
            <th>Secretaria</th>
            <th>Etapa</th>
            <th>Valor</th>
            <th>Data Prot.</th>
          </tr>
        </thead>
        <div style={{ marginTop: 30 }}></div>
        <tbody>
          {protocolos.map((protocolo, index) => (
            <React.Fragment key={protocolo.id}>
              <tr>
                <td>{protocolo.assunto}</td>
                <td>{protocolo.descricao}</td>
                <td>{protocolo.departamento}</td>
                <td>{protocolo.secretaria.nome_secretaria}</td>
                <td>{protocolo.status}</td>
                <td>{protocolo.valor}</td>
                <td>{format(new Date(protocolo.data_protocolo), 'dd/MM/yyyy HH:mm')}</td>
              </tr>
              {index < protocolos.length - 1 && <tr><td colSpan="7"><hr /></td></tr>}
            </React.Fragment>
          ))}
        </tbody>

      </table>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', width: 200, alignItems: 'center', margin: 'auto', justifyContent: 'space-between', height: '30vh', padding: 100 }}>
      {!mostrarTabela && (<button className="btn-log" onClick={handleSubmit}>Consultar</button>)}
        <button className="btn-log" onClick={() => (window.location.href = '/paginaInicial')}>Voltar</button>
      </div>
    </>
  );
}

export default Consultar;
