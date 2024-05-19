import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import URL from '../services/url';

const Redirecionamentos = () => {
  const [redirecionamentos, setRedirecionamentos] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('ANDAMENTO');
  const [selectedRedirecionamentos, setSelectedRedirecionamentos] = useState({});
  const [secretarias, setSecretarias] = useState([]);
  const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");


  const axiosInstance = axios.create({
    baseURL: URL, // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });

  // Recuperar o token do localStorage
  const token = localStorage.getItem('token');

  // Adicionar o token ao cabeçalho de autorização
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    async function fetchRedirecionamentos() {
      try {
        const response1 = await axiosInstance.get('/protoon/secretaria');
        setSecretarias(response1.data);

        const response2 = await axiosInstance.get(`/protoon/redirecionamento`);
        const groupedData = groupByStatusAndDate(response2.data);
        setRedirecionamentos(groupedData);
      } catch (error) {
        console.error('Erro ao buscar os redirecionamentos:', error);
      }
    }
    fetchRedirecionamentos();
  }, []);

  const handleSecretariaChange = (e) => {
    const selectedSecretariaId = e.target.value;
    setIdSecretariaSelecionada(selectedSecretariaId);
  };

  const groupByStatusAndDate = (redirecionamentos) => {
    return redirecionamentos.reduce((groups, redirecionamento) => {
      const status = redirecionamento.statusRedirecionamento;
      const date = redirecionamento.dtSolicitacao.split('T')[0];
      if (!groups[status]) {
        groups[status] = {};
      }
      if (!groups[status][date]) {
        groups[status][date] = [];
      }
      groups[status][date].push(redirecionamento);
      return groups;
    }, {});
  };

  const toggleExpand = (date) => {
    setExpandedDates((prevExpandedDates) => ({
      ...prevExpandedDates,
      [date]: !prevExpandedDates[date],
    }));
  };

  const handleCheckboxChange = (id, checked) => {
    setSelectedRedirecionamentos((prevSelected) => {
      if (checked) {
        return { ...prevSelected, [id]: '' }; // Initialize with an empty status
      } else {
        const updatedSelected = { ...prevSelected };
        delete updatedSelected[id];
        return updatedSelected;
      }
    });
  };

  const handleStatusChange = (id, status) => {
    setSelectedRedirecionamentos((prevSelected) => ({
      ...prevSelected,
      [id]: status,
    }));
  };
  const handleUpdateStatus = async (id) => {
    try {
      const status = selectedRedirecionamentos[id];
      if (status) {
        const response1 = await axiosInstance.put(`/protoon/redirecionamento/by-coordenador/${id}`, {
          statusRedirecionamento: status
        });
        alert('Status atualizado com sucesso!');
        if(response1.data.statusRedirecionamento === "APROVADO"){
            const protocolo = response1.data.protocolo
            const response2 = await axiosInstance.get(`/protoon/secretaria/${idSecretariaSelecionada}`)
            const secretariaData = response2.data;
            const response3 = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/departamento/${response1.data.protocolo.numero_protocolo}`, {
          ...protocolo,
          secretaria: secretariaData
        });
        }
       

        // Atualiza a lista os redirecionamentos depois de atualizar o status
        const response4 = await axiosInstance.get(`/protoon/redirecionamento`);
        const groupedData = groupByStatusAndDate(response4.data);
        setRedirecionamentos(groupedData);
      } else {
        alert('Selecione um status para atualizar.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o redirecionamento:', error.response ? error.response.data : error);
      alert(error.response ? error.response.data.message : 'Erro ao atualizar o redirecionamento');
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="status">Selecionar Status: </label>
        <br />
        <select id="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="ANDAMENTO">ANDAMENTO</option>
          <option value="APROVADO">APROVADO</option>
          <option value="RECUSADO ">RECUSADO</option>
        </select>
      </div>

      {redirecionamentos[selectedStatus] && Object.keys(redirecionamentos[selectedStatus]).map((date) => (
        <div key={date}>
          <div onClick={() => toggleExpand(date)} style={{ cursor: 'pointer', background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
            <strong>{date}</strong>
          </div>
          {expandedDates[date] && (
            <ul>
              {redirecionamentos[selectedStatus][date].map((redirecionamento) => (
                <li key={redirecionamento.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0' }}>
                  {selectedStatus === 'ANDAMENTO' && (
                    <div>
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(redirecionamento.id, e.target.checked)}
                      />
                      {selectedRedirecionamentos[redirecionamento.id] !== undefined && (
                        <>
                          <select
                            value={selectedRedirecionamentos[redirecionamento.id]}
                            onChange={(e) => handleStatusChange(redirecionamento.id, e.target.value)}
                          >
                            <option value="">Selecione</option>
                            <option value="APROVADO">APROVADO</option>
                            <option value="RECUSADO">RECUSADO</option>
                          </select>
                          <button onClick={() => handleUpdateStatus(redirecionamento.id)}>Atualizar Status</button>

                          <select
              style={{ fontSize: 10, marginRight: 10, padding: 10, borderRadius: 10, textAlign: "center" }}
              value={idSecretariaSelecionada} // Aqui se precisa usar idSecretariaSelecionada em vez de selectedSecretaria
              onChange={handleSecretariaChange}
            >
              <option value="">Selecione a secretaria</option>
              {secretarias.map(secretaria => (
                <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                  {secretaria.nome_secretaria}
                </option>
              ))}
            </select>
                        </>
                      )}
                    </div>
                  )}
                  <p><strong>Status:</strong> {redirecionamento.statusRedirecionamento}</p>
                  <p><strong>Descrição:</strong> {redirecionamento.descricao}</p>
                  <p><strong>Nova Secretaria:</strong> {redirecionamento.novaSecretaria || 'N/A'}</p>
                  <p><strong>Data de Solicitação:</strong> {new Date(redirecionamento.dtSolicitacao).toLocaleString()}</p>
                  {redirecionamento.dtConfirmacao && <p><strong>Data de Confirmação:</strong> {new Date(redirecionamento.dtConfirmacao).toLocaleString()}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Redirecionamentos;
