
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import URL from '../services/url';

function Logs() {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const [logs, setLogs] = useState([]);
  const [pesquisarFun, setPesquisarFun] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axiosInstance.get(`/log`);
        console.log(response.data); // Verifica se os logs estão sendo recebidos corretamente
        setLogs(response.data);
      } catch (error) {
        console.error('Erro ao buscar o log:', error);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    return log.mensagem.toLowerCase().includes(pesquisarFun.toLowerCase());
  });

  return (
    <>
      <div style={{ paddingInline: 150 }}>
        <h1>Logs</h1>
        <input
          type="text"
          placeholder="Digite uma palavra chave"
          value={pesquisarFun}
          onChange={(e) => setPesquisarFun(e.target.value)}
        />
        <div style={{ padding: 20, borderRadius: 20, border: '1px solid #ccc', backgroundColor: '#f9f9f9', marginBottom: 10 }}>
          <ul>
            {filteredLogs.map((log, index) => (
              <li key={index}>{log.mensagem}</li>
            ))}
          </ul>
        </div >
        <button className="btn-log" onClick={() => (navigate('/'))}>Voltar</button>
      </div>
    </>
  );
}

export default Logs