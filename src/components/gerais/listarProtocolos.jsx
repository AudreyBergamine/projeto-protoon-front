
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import URL from '../services/url';
import { differenceInDays, parseISO } from 'date-fns';

function ListarProtocolosBySecretaria() {
  const axiosInstance = axios.create({
    baseURL: URL, 
    withCredentials: true,
  });

  // const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");
  const [protocolos, setProtocolos] = useState([]);
  const [pesquisarProt, setPesquisarProt] = useState(''); //Pesquisar protocolos
  const navigate = useNavigate();
  // Recuperar o token do localStorage
  const token = localStorage.getItem('token');

  const [prazoConclusaoSimulado, setPrazoConclusaoSimulado] = useState({}); // Valor inicial em minutos
  const [boletoSimulado, setboletoSimulado] = useState({}); //Valor para vender o boleto em segundos
  const isBoletoVencidoRunning = useRef(false);
  const [filtroStatus, setFiltroStatus] = useState([]);

  // Adicionar o token ao cabeçalho de autorização
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;


  useEffect(() => {
    async function fetchProtocolos() {
      try {
        const response1 = await axiosInstance.get(`/protoon/funcionarios/bytoken`);
        const id_secretaria = response1.data.secretaria.id_secretaria;

        // const response2 = await axiosInstance.get(`/protoon/secretaria/protocolos/` + id_secretaria);
        const response2 = await axiosInstance.get(`/protoon/protocolo/todos-protocolos`);
        const protocolosFiltrados = response2.data.filter(protocolo =>
          protocolo.secretaria === null ||
          (protocolo.secretaria.id_secretaria === id_secretaria)
        );

        setProtocolos(protocolosFiltrados); // Atualiza o estado apenas com os protocolos filtrados

      } catch (error) {
        console.error('Erro ao buscar as secretarias:', error);
      }
    }
    fetchProtocolos();

    // Simulação de contagem regressiva para o prazo
    const intervalId = setInterval(() => {
      setPrazoConclusaoSimulado((prev) => {
        const novosPrazoConclusao = { ...prev };
        let todosFinalizados = true;

        Object.keys(novosPrazoConclusao).forEach(id => {
          novosPrazoConclusao[id] -= 1; // Atualiza o tempo a cada segundo (1000 ms), aumente se quiser acelerar a Simulação
          todosFinalizados = false; // Continuar se não estiver finalizado
        });

        if (todosFinalizados) {
          clearInterval(intervalId); // Para o contador se todos os prazos tiverem vencido
        }
        return novosPrazoConclusao;
      });

      // Faz contagem regressiva do boleto
      setboletoSimulado(prevBoleto => {
        const novosBoleto = { ...prevBoleto };
        Object.keys(novosBoleto).forEach(id => {
          if (novosBoleto[id] > 0) {
            novosBoleto[id] -= 1;
          }
        });
        return novosBoleto;
      });
    }, 1000); // Atualiza a cada segundo

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (protocolos.length > 0 && !isBoletoVencidoRunning.current) {
      isBoletoVencidoRunning.current = true;  // Bloqueia novas chamadas
      boletoVencido().finally(() => {
        isBoletoVencidoRunning.current = false; // Libera para futuras chamadas
      });
    }
  }, [protocolos]);

  // Função chamada para ver se o boleto venceu
  const boletoVencido = async () => {
    for (const protocolo of protocolos) {
      if (protocolo.status === "PAGAMENTO_PENDENTE") {
        const dataProtocolo = new Date(protocolo.data_protocolo); // Converter string para Date

        const diferencaDias = (Date.now() - dataProtocolo.getTime()) / (1000 * 60 * 60 * 24);
        // Verifica se passaram 4 dias
        if (diferencaDias >= 4 && protocolo.status !== "CANCELADO") {
          // Faz o update do status para "CANCELADO"
          try {
            const response = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/status/${protocolo.numero_protocolo}`, {
              ...protocolo,
              status: "CANCELADO"
            });
          } catch (error) {
            console.error("Erro ao cancelar o protocolo", error);
          }
          let isRequesting = false;
          if (!isRequesting) {
            isRequesting = true;
            try {
              const response1 = await axiosInstance.post(
                `/protoon/devolutiva/criar-devolutiva-boleto`, protocolo);
            } catch (error) {
              console.error("Erro ao enviar a devolutiva", error);
            } finally {
              isRequesting = false;
            }
          }
        }
      }
    }
  };

  // Função para determinar a cor baseada no prazo
  const prazoCor = (prazoConclusao, dataProtocolo) => {
    if (!prazoConclusao || !dataProtocolo) return {}; // Retorna sem estilo se os valores forem inválidos

    const prazo = parseISO(prazoConclusao); // Converte string para data
    const dataInicio = parseISO(dataProtocolo);
    const diasRestantes = differenceInDays(prazo, dataInicio); // Diferença de dias

    if (diasRestantes <= 3) { // Menos de 4 dias para o vencimento
      return { backgroundColor: 'red', color: 'white' };
    }
    if (diasRestantes <= 8) { // Menos de 7 dias para o vencimento
      return { backgroundColor: 'yellow', color: 'black' };
    }
    return {}; // Estilo padrão
  };

  const handleClick = (id) => {
    // Redirecionar para outra página com o ID do protocolo na URL usando navigater
    navigate(`/protocolo/${id}`);
  };
  const voltarIndex = async () => {
    navigate("/")
  }

  //Função para formatar a data e a hora com base no Brasil/sp
  const formatarDataHora = (dataString) => {
    const data = new Date(dataString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo"
    };
    return data.toLocaleString("pt-BR", options);
  };

  // Função para filtrar e ordenar os protocolos por prazo
  const filteredProtocolos = protocolos?.length > 0
    ? protocolos
      .filter(protocolo =>
        protocolo.numero_protocolo?.toLowerCase().includes(pesquisarProt.toLowerCase())
      )
      .filter(protocolo =>
        filtroStatus.length > 0
          ? filtroStatus.includes(protocolo.status) // Mostra apenas os selecionados
          : !["CONCLUIDO", "CANCELADO", "RECUSADO", "PAGAMENTO_PENDENTE"].includes(protocolo.status) // Se nenhum for selecionado, mostra os outros
      )
      .sort((a, b) => {
        const prazoA = a.prazoConclusao ? new Date(a.prazoConclusao) : new Date(9999, 11, 31);
        const prazoB = b.prazoConclusao ? new Date(b.prazoConclusao) : new Date(9999, 11, 31);
        return prazoA - prazoB;
      })
    : [];

  const toggleFiltro = (status) => {
    setFiltroStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status) // Remove se já estiver selecionado
        : [...prev, status] // Adiciona se não estiver selecionado
    );
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <h1>Lista de Protocolos</h1>
        <input
          type="text"
          placeholder="Pesquisar por número de protocolo..."
          value={pesquisarProt}
          onChange={(e) => setPesquisarProt(e.target.value)}
        />
        <div style={{ marginTop: 10, marginBottom: 50, paddingInline: 50 }}>
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            {["CONCLUIDO", "CANCELADO", "RECUSADO", "PAGAMENTO_PENDENTE"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => toggleFiltro(status)}
                  style={{
                    padding: "10px 15px",
                    fontSize: "16px",
                    backgroundColor: filtroStatus.includes(status) ? "#2D9596" : "gray",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
        <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '100%', padding: 30 }}>
          <thead>
            <tr>
              <th>Assunto</th>
              <th>Número</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Valor</th>
              {filtroStatus.length === 0 && (
                <th>Prazo de Conclusão</th>
              )}
              {/* <th>Simulação Boleto(s)</th> */}
              {/* <th>Simulação do prazo em Segundos</th> */}
            </tr>
          </thead>
          <div style={{ marginTop: 30 }}></div>
          <tbody>
            {filteredProtocolos
              .map((protocolo, index) => {
                const prazoEmSegundos = prazoConclusaoSimulado[protocolo.id_protocolo] || 0; // Converte o prazo em dias para segundos
                const prazo = protocolo.prazoConclusao; // Suponha que seja "2024-09-10"
                const dataFormatada = prazo ? new Date(prazo).toLocaleDateString('pt-BR') : "";
                const prazoStyle = prazoCor(protocolo.prazoConclusao, protocolo.data_protocolo);
                return (
                  <React.Fragment key={protocolo.id_protocolo}>
                    <tr onClick={() => handleClick(protocolo.id_protocolo)} className="rowTable" style={prazoStyle}>
                      <td style={{ textAlign: 'center', minWidth: 300 }}>{protocolo.assunto}</td>
                      <td style={{ textAlign: 'center', minWidth: 80 }}>{protocolo.numero_protocolo}</td>
                      <td style={{ textAlign: 'center', minWidth: 200 }}>{formatarDataHora(protocolo.data_protocolo)}</td>
                      <td style={{ textAlign: 'center', minWidth: 250, maxWidth: 450, wordWrap: 'break-word' }}>
                        <div style={{ maxHeight: '50px', overflowY: 'auto' }}>
                          {protocolo.descricao}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', minWidth: 200 }}>{protocolo.status}</td>
                      <td style={{ textAlign: 'center', minWidth: 100 }}>
                        {protocolo.valor !== null && protocolo.valor !== undefined
                          ? `R$ ${protocolo.valor.toFixed(2)}`
                          : ""}
                      </td>
                      <td style={{ textAlign: 'center', minWidth: 100 }}>{dataFormatada}</td>
                    </tr>
                    {index !== filteredProtocolos.length - 1 && <tr><td colSpan="6"><hr style={{ margin: 0 }} /></td></tr>}
                  </React.Fragment>
                );
              })}

          </tbody>
        </table>
        <button style={{ marginBottom: 200 }} className="btn-log" onClick={voltarIndex}>Voltar</button>
      </div >
    </>
  );
}

export default ListarProtocolosBySecretaria