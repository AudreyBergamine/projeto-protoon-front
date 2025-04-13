import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import URL from "../services/url";

// Componentes estilizados
const SecretariaSelect = styled.select`
  padding: 10px;
  margin: 10px 0 20px 20px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ddd;
  min-width: 250px;
`;

const AnalysisContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #8884d8;
  white-space: pre-wrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const GenerateButton = styled.button`
  padding: 10px 15px;
  background-color: #8884d8;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 0 20px 20px;
  font-size: 14px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #6a66b8;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ChartContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 10px;
  margin-top: 10px;
  background-color: #ffebee;
  border-radius: 4px;
`;

const Relatorios = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    protocolos: [],
    secretarias: [],
    idSecretariaSelecionada: "",
    analysis: "",
    loadingAnalysis: false,
    error: null
  });

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
    timeout: 30000
  });

  // Verificação de permissão
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "COORDENADOR") {
      navigate("/");
    }
  }, [navigate]);

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [secretariasRes, protocolosRes] = await Promise.all([
          axiosInstance.get("/protoon/secretaria"),
          axiosInstance.get("/protoon/protocolo/todos-protocolos")
        ]);

        setState(prev => ({
          ...prev,
          secretarias: secretariasRes.data,
          protocolos: protocolosRes.data
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: "Erro ao carregar dados. Tente recarregar a página."
        }));
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleSecretariaChange = (e) => {
    setState(prev => ({
      ...prev,
      idSecretariaSelecionada: e.target.value,
      analysis: "",
      error: null
    }));
  };

  // Filtrar protocolos
  const protocolosFiltrados = state.idSecretariaSelecionada
    ? state.protocolos.filter(
      protocolo => protocolo.secretaria &&
        protocolo.secretaria.id_secretaria === Number(state.idSecretariaSelecionada)
    )
    : state.protocolos;

  // Preparar dados para o gráfico
  const prepareChartData = () => {
    const dados = protocolosFiltrados.reduce((acc, protocolo) => {
      const date = new Date(protocolo.data_protocolo);
      const dataFormatada = date.toLocaleDateString("pt-BR");
      const existente = acc.find(dado => dado.data === dataFormatada);

      if (existente) {
        existente.quantidade += 1;
      } else {
        acc.push({
          data: dataFormatada,
          quantidade: 1,
          // Adiciona timestamp para ordenação
          timestamp: date.getTime()
        });
      }

      return acc;
    }, []);

    return dados.sort((a, b) => a.timestamp - b.timestamp);
  };

  const dadosParaGrafico = prepareChartData();

  const generateAnalysis = async () => {
    if (protocolosFiltrados.length === 0) return;

    setState(prev => ({ ...prev, loadingAnalysis: true, analysis: "", error: null }));

    const chunkSize = 10;
    const chunks = [];

    for (let i = 0; i < protocolosFiltrados.length; i += chunkSize) {
      chunks.push(protocolosFiltrados.slice(i, i + chunkSize));
    }

    try {
      let fullAnalysis = "";

      for (const chunk of chunks) {
        const response = await axiosInstance.post(
          "/api/analise/protocolos",
          chunk,
          {
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.data?.analysis) {
          fullAnalysis += response.data.analysis + "\n\n";
        }
      }

      setState(prev => ({
        ...prev,
        analysis: fullAnalysis.trim() || "Análise gerada com sucesso",
        error: null
      }));
    } catch (error) {
      let errorMessage = "Erro ao gerar análise";

      if (error.response) {
        errorMessage = error.response.data?.message ||
          `Erro ${error.response.status}: ${error.response.statusText}`;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Tempo de resposta excedido. Tente novamente.";
      }

      setState(prev => ({
        ...prev,
        error: errorMessage
      }));
    } finally {
      setState(prev => ({ ...prev, loadingAnalysis: false }));
    }
  };


  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Relatório de Protocolos</h2>

      <SecretariaSelect
        value={state.idSecretariaSelecionada}
        onChange={handleSecretariaChange}
      >
        <option value="">Todas as Secretarias</option>
        {state.secretarias.map(secretaria => (
          <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
            {secretaria.nome_secretaria}
          </option>
        ))}
      </SecretariaSelect>

      <GenerateButton
        onClick={generateAnalysis}
        disabled={state.loadingAnalysis || protocolosFiltrados.length === 0}
      >
        {state.loadingAnalysis ? "Gerando Análise..." : "Gerar Análise com IA"}
      </GenerateButton>

      {state.error && <ErrorMessage>{state.error}</ErrorMessage>}

      <ChartContainer>
        <h3>Distribuição Temporal de Protocolos</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={dadosParaGrafico}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="data"
              label={{ value: "Data", position: "insideBottomRight", offset: -10 }}
            />
            <YAxis
              label={{ value: "Quantidade", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="quantidade"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {state.analysis && (
        <AnalysisContainer>
          <h3>Análise de IA</h3>
          <div>{state.analysis}</div>
        </AnalysisContainer>
      )}
    </div>
  );
};

export default Relatorios;