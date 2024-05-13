
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

  return (
    <>
      <div style={{ padding: 20 }}>
        <h1>Logs</h1>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log.mensagem}</li> // Supondo que cada log tenha uma propriedade 'message'
          ))}
        </ul>
        <button className="btn-log" onClick={() => (navigate('/'))}>Voltar</button>
      </div >
    </>
  );
}

export default Logs