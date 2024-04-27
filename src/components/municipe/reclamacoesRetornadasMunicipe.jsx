import React, { useState, useEffect } from "react";
import axios from 'axios';
import { format } from 'date-fns';

function ReclamacoesRetornadasMunicipe() {
  const [protocolos, setProtocolos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const id = localStorage.getItem('idMunicipe');
        const response = await axios.get(`http://localhost:8080/protoon/municipe/municipes/protocolos/${id}`);
        const protocolosDoMunicipe = response.data;
        const protocolosFiltrados = protocolosDoMunicipe.filter(protocolo => protocolo.status === "CIENCIA");
        setProtocolos(protocolosFiltrados);
      } catch (error) {
        console.error('Erro ao enviar os dados:', error);
      }
    }

    fetchData();
  }, []);

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  return (
    <>
      <table style={{ marginTop: 20, borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Assunto</th>
            <th>Descrição</th>
            <th>Secretaria</th>
            <th>Etapa</th>
            <th>Valor</th>
            <th>Data Prot.</th>
          </tr>
        </thead>
        <div style={{ marginTop: 30 }}></div>
        <tbody>
          {protocolos.map((protocolo, index) => (
            <React.Fragment key={protocolo.id_protocolo}>
              <tr>
                <td style={{ textAlign: 'center', minWidth: 200 }}>{protocolo.assunto}</td>
                <td style={{ textAlign: 'center', minWidth: 200, maxWidth: 200, wordWrap: 'break-word' }}>
                  <div style={{ maxHeight: '50px', overflowY: 'auto' }}>
                    {protocolo.descricao}
                  </div>
                </td>
                <td style={{ textAlign: 'center', minWidth: 200 }}>{protocolo.secretaria.nome_secretaria}</td>
                <td style={{ textAlign: 'center', minWidth: 100 }}>{protocolo.status}</td>
                <td style={{ textAlign: 'center', minWidth: 100 }}>{protocolo.valor}</td>
                <td style={{ textAlign: 'center', minWidth: 100 }}>{format(new Date(protocolo.data_protocolo), 'dd/MM/yyyy HH:mm')}</td>
              </tr>
              {index < protocolos.length - 1 && <tr><td colSpan="7"><hr /></td></tr>}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', flexDirection: 'column', width: 200, alignItems: 'center', margin: 'auto', justifyContent: 'space-between', height: '30vh', padding: 100 }}>
        <button className="btn-log" onClick={() => (window.location.href = '/paginaInicial')}>Voltar</button>
      </div>
    </>
  );
}

export default ReclamacoesRetornadasMunicipe;