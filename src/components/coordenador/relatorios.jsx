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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 700px;
  width: 90%;
  white-space: pre-wrap;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const CloseButton = styled.button`
  background: #8884d8;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  float: right;
  cursor: pointer;
`;

const Relatorios = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
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

  const generateAnalysisManual = () => {
    if (protocolosFiltrados.length === 0) return;

    setState(prev => ({ ...prev, loadingAnalysis: true, analysis: "", error: null }));

    try {
      const problemasCount = {};
      const mesesCount = {};

      protocolosFiltrados.forEach((protocolo) => {
        // Contagem por tipo de problema
        const tipo = protocolo.assunto || "Desconhecido";
        problemasCount[tipo] = (problemasCount[tipo] || 0) + 1;

        // Contagem por mês
        const data = new Date(protocolo.data_protocolo);
        const mes = `${data.getMonth() + 1}/${data.getFullYear()}`; // Ex: 4/2025
        mesesCount[mes] = (mesesCount[mes] || 0) + 1;
      });

      // Tipo de problema com mais e menos ocorrências
      const problemasEntries = Object.entries(problemasCount);
      const [problemaMaisComum] = problemasEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      const [problemaMenosComum] = problemasEntries.reduce((a, b) => a[1] < b[1] ? a : b);

      // Mês com mais e menos protocolos
      const mesesEntries = Object.entries(mesesCount);
      const [mesMaisProtocolos] = mesesEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      const [mesMenosProtocolos] = mesesEntries.reduce((a, b) => a[1] < b[1] ? a : b);

      const qtdProblemaMaisComum = protocolosFiltrados.filter(
        protocolo => protocolo.assunto === problemaMaisComum
      ).length;

      const qtdProblemaMenosComum = protocolosFiltrados.filter(
        protocolo => protocolo.assunto === problemaMenosComum
      ).length;

      const qtdMesMaisProtocolos = protocolosFiltrados.filter(
        protocolo => {
          const data = new Date(protocolo.data_protocolo);
          const mes = `${data.getMonth() + 1}/${data.getFullYear()}`;
          return mes === mesMaisProtocolos;
        }
      ).length;

      const qtdMesMenosProtocolos = protocolosFiltrados.filter(
        protocolo => {
          const data = new Date(protocolo.data_protocolo);
          const mes = `${data.getMonth() + 1}/${data.getFullYear()}`;
          return mes === mesMenosProtocolos;
        }
      ).length;

      const relatorio = `
📊 RELATÓRIO

🔧 Tipo de problema mais comum: ${problemaMaisComum} (${qtdProblemaMaisComum} ocorrências)
🔍 Tipo de problema menos comum: ${problemaMenosComum} (${qtdProblemaMenosComum} ocorrências)

📅 Mês com mais protocolos: ${mesMaisProtocolos} (${qtdMesMaisProtocolos} protocolos)
📉 Mês com menos protocolos: ${mesMenosProtocolos} (${qtdMesMenosProtocolos} protocolos)
`;

      setState(prev => ({
        ...prev,
        analysis: relatorio.trim(),
        error: null
      }));
      setShowModal(true);

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: "Erro ao gerar análise manual"
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

      <GenerateButton
        onClick={generateAnalysisManual}
        disabled={state.loadingAnalysis || protocolosFiltrados.length === 0}
      >
        {state.loadingAnalysis ? "Gerando Análise..." : "Gerar Análise"}
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

      <ModalOverlay show={showModal}>
        <ModalContent>
          <CloseButton onClick={() => setShowModal(false)}>Fechar</CloseButton>
          <h3>Análise</h3>
          <div>{state.analysis}</div>
        </ModalContent>
      </ModalOverlay>

    </div>
  );
};

export default Relatorios;