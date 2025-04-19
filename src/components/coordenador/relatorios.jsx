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

// Adicione estilos para os novos componentes
const PeriodoContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Distribui espaço entre os itens */
  align-items: center;
  margin: 0 0 20px 20px;
  gap: 15px;
  width: calc(100% - 20px); /* Ajusta a largura para compensar a margem */
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PeriodoSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const DateInput = styled.input`
  padding: 8px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const PeriodoLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const AssuntoSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ddd;
  min-width: 250px;
`;

const Relatorios = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState({
    protocolos: [],
    secretarias: [],
    idSecretariaSelecionada: "",
    analysis: "",
    analysisType: "",
    loadingAnalysis: false,
    error: null,
    periodoSelecionado: "30", // Valor padrão: 30 dias
    dataInicio: null,
    dataFim: null,
    assuntoSelecionado: "", // Novo estado para o filtro de assunto
    assuntosDisponiveis: [] // Lista de assuntos únicos
  });

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
    timeout: 30000
  });

  const filtrarPorPeriodo = (protocolos) => {
    if (!state.periodoSelecionado) { // Se for "" (Todo Período)
      return protocolos; // Retorna todos sem filtrar
    }

    const agora = new Date();
    let dataInicioFiltro = new Date();
    let dataFimFiltro = new Date();

    // Definir período baseado na seleção
    switch (state.periodoSelecionado) {
      case "7":
        dataInicioFiltro.setDate(agora.getDate() - 7);
        break;
      case "30":
        dataInicioFiltro.setDate(agora.getDate() - 30);
        break;
      case "90":
        dataInicioFiltro.setDate(agora.getDate() - 90);
        break;
      case "180":
        dataInicioFiltro.setDate(agora.getDate() - 180);
        break;
      case "365":
        dataInicioFiltro.setDate(agora.getDate() - 365);
        break;
      case "custom":
        if (state.dataInicio) {
          dataInicioFiltro = new Date(state.dataInicio);
        }
        if (state.dataFim) {
          dataFimFiltro = new Date(state.dataFim);
        } else {
          dataFimFiltro = agora;
        }
        break;
      default:
        return protocolos;
    }

    return protocolos.filter(protocolo => {
      const dataProtocolo = new Date(protocolo.data_protocolo);
      return dataProtocolo >= dataInicioFiltro && dataProtocolo <= dataFimFiltro;
    });
  };

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

        // Extrai assuntos únicos dos protocolos
        const assuntosUnicos = [...new Set(protocolosRes.data
          .map(p => p.assunto)
          .filter(assunto => assunto))]; // Filtra valores nulos/undefined

        setState(prev => ({
          ...prev,
          secretarias: secretariasRes.data,
          protocolos: protocolosRes.data,
          assuntosDisponiveis: assuntosUnicos
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

  const filtrarPorAssunto = (protocolos) => {
    if (!state.assuntoSelecionado) {
      return protocolos;
    }
    return protocolos.filter(protocolo =>
      protocolo.assunto === state.assuntoSelecionado
    );
  };

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
    : [...state.protocolos]; // Cria uma nova array com todos protocolos quando não há filtro

  const protocolosPeriodoFiltrados = filtrarPorPeriodo(protocolosFiltrados);
  const protocolosAllFiltrados = filtrarPorAssunto(protocolosPeriodoFiltrados);

  // Preparar dados para o gráfico
  const prepareChartData = () => {
    if (protocolosAllFiltrados.length === 0) return [];

    const dados = protocolosAllFiltrados.reduce((acc, protocolo) => {
      if (!protocolo.data_protocolo) return acc; // Pula protocolos sem data

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

    setState(prev => ({ ...prev, loadingAnalysis: true, analysis: "", analysisType: "ia", error: null }));

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

    setState(prev => ({ ...prev, loadingAnalysis: true, analysis: "", analysisType: "Manual", error: null }));

    try {
      const problemasCount = {};
      const mesesCount = {};

      protocolosAllFiltrados.forEach((protocolo) => {
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

      const qtdProblemaMaisComum = protocolosAllFiltrados.filter(
        protocolo => protocolo.assunto === problemaMaisComum
      ).length;

      const qtdProblemaMenosComum = protocolosAllFiltrados.filter(
        protocolo => protocolo.assunto === problemaMenosComum
      ).length;

      const qtdMesMaisProtocolos = protocolosAllFiltrados.filter(
        protocolo => {
          const data = new Date(protocolo.data_protocolo);
          const mes = `${data.getMonth() + 1}/${data.getFullYear()}`;
          return mes === mesMaisProtocolos;
        }
      ).length;

      const qtdMesMenosProtocolos = protocolosAllFiltrados.filter(
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

  const ChartInfoLabel = styled.div`
  margin: 10px 0;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
`;

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

      <PeriodoContainer>
        {/* Filtro de Período */}
        <FilterGroup>
          <PeriodoLabel>Período:</PeriodoLabel>
          <PeriodoSelect
            value={state.periodoSelecionado}
            onChange={(e) => setState(prev => ({
              ...prev,
              periodoSelecionado: e.target.value,
              dataInicio: null,
              dataFim: null
            }))}
          >
            <option value="">Todo Período</option>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 3 meses</option>
            <option value="180">Últimos 6 meses</option>
            <option value="365">Últimos 12 meses</option>
            <option value="custom">Personalizado</option>
          </PeriodoSelect>

          {state.periodoSelecionado === "custom" && (
            <>
              <DateInput
                type="date"
                value={state.dataInicio || ""}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  dataInicio: e.target.value
                }))}
              />
              <span>até</span>
              <DateInput
                type="date"
                value={state.dataFim || ""}
                onChange={(e) => setState(prev => ({
                  ...prev,
                  dataFim: e.target.value
                }))}
              />
            </>
          )}
        </FilterGroup>

        {/* Filtro de Assunto */}
        <FilterGroup>
          <PeriodoLabel>Assunto:</PeriodoLabel>
          <AssuntoSelect
            value={state.assuntoSelecionado}
            onChange={(e) => setState(prev => ({
              ...prev,
              assuntoSelecionado: e.target.value
            }))}
          >
            <option value="">Todos os Assuntos</option>
            {state.assuntosDisponiveis.map((assunto, index) => (
              <option key={index} value={assunto}>
                {assunto}
              </option>
            ))}
          </AssuntoSelect>
        </FilterGroup>
      </PeriodoContainer>      

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
        <ChartInfoLabel>
          <span style={{ marginRight: '15px' }}>
            📅 <strong>{dadosParaGrafico.length}</strong> dias no gráfico
          </span>
          <span>
            📋 <strong>{protocolosAllFiltrados.length}</strong> protocolos no período
          </span>
          {state.periodoSelecionado === "custom" && state.dataInicio && state.dataFim && (
            <span style={{ marginLeft: '15px' }}>
              📅 Período: {new Date(state.dataInicio).toLocaleDateString()} a {new Date(state.dataFim).toLocaleDateString()}
            </span>
          )}
        </ChartInfoLabel>
        {dadosParaGrafico.length > 0 && (
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
        )}
      </ChartContainer>

      {state.analysis && state.analysis == "ia" && (
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