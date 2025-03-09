import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import URL from "../services/url";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SecretariaSelect = styled.select`
  padding: 10px;
  margin-top: 10px;
  margin-left: 20px;
  font-size: 14px;
  border-radius: 5px;
`;

function Relatorios() {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const [protocolos, setProtocolos] = useState([]);
  const [secretarias, setSecretarias] = useState([]);
  const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");

  const role = localStorage.getItem("role");

  if (role !== "COORDENADOR") {
    navigate("/");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar todas as secretarias
        const responseSecretarias = await axiosInstance.get("/protoon/secretaria");
        setSecretarias(responseSecretarias.data);

        // Buscar todos os protocolos
        const responseProtocolos = await axiosInstance.get("/protoon/protocolo/todos-protocolos");
        setProtocolos(responseProtocolos.data);
        console.log(protocolos)
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  const handleSecretariaChange = (e) => {
    setIdSecretariaSelecionada(e.target.value);
  };

  // Filtrar protocolos pela secretaria selecionada
  const protocolosFiltrados = idSecretariaSelecionada
    ? protocolos.filter(
      (protocolo) =>
        protocolo.secretaria && // Verifica se secretaria existe
        protocolo.secretaria.id_secretaria === Number(idSecretariaSelecionada) // Compara como número
    )
    : protocolos;

  // Contar protocolos por data
  const dadosParaGrafico = protocolosFiltrados.reduce((acc, protocolo) => {
    const dataFormatada = new Date(protocolo.data_protocolo).toLocaleDateString("pt-BR");
    const existente = acc.find((dado) => dado.data === dataFormatada);

    if (existente) {
      existente.quantidade += 1;
    } else {
      acc.push({ data: dataFormatada, quantidade: 1 });
    }

    return acc;
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Relatório de Protocolos</h2>

      <select value={idSecretariaSelecionada} onChange={handleSecretariaChange} style={{ padding: 10, marginBottom: 20 }}>
        <option value="">Todas as Secretarias</option>
        {secretarias.map((secretaria) => (
          <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
            {secretaria.nome_secretaria}
          </option>
        ))}
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dadosParaGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="quantidade" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Relatorios;
