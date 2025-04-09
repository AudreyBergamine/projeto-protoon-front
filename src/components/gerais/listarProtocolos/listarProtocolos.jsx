import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import URL from '../../services/url';
import { differenceInDays, parseISO } from 'date-fns';
import styles from './listarProtocolos.module.css';

function ListarProtocolosBySecretaria() {
  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const [protocolos, setProtocolos] = useState([]);
  const [pesquisarProt, setPesquisarProt] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [prazoConclusaoSimulado, setPrazoConclusaoSimulado] = useState({});
  const [boletoSimulado, setboletoSimulado] = useState({});
  const isBoletoVencidoRunning = useRef(false);
  const [filtroStatus, setFiltroStatus] = useState([]);

  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    async function fetchProtocolos() {
      try {
        const response1 = await axiosInstance.get(`/protoon/funcionarios/bytoken`);
        const id_secretaria = response1.data.secretaria.id_secretaria;
        const response2 = await axiosInstance.get(`/protoon/protocolo/todos-protocolos`);
        const protocolosFiltrados = response2.data.filter(protocolo =>
          protocolo.secretaria === null ||
          (protocolo.secretaria.id_secretaria === id_secretaria)
        );
        setProtocolos(protocolosFiltrados);
      } catch (error) {
        console.error('Erro ao buscar as secretarias:', error);
      }
    }
    fetchProtocolos();

    const intervalId = setInterval(() => {
      setPrazoConclusaoSimulado((prev) => {
        const novosPrazoConclusao = { ...prev };
        let todosFinalizados = true;

        Object.keys(novosPrazoConclusao).forEach(id => {
          novosPrazoConclusao[id] -= 1;
          todosFinalizados = false;
        });

        if (todosFinalizados) {
          clearInterval(intervalId);
        }
        return novosPrazoConclusao;
      });

      setboletoSimulado(prevBoleto => {
        const novosBoleto = { ...prevBoleto };
        Object.keys(novosBoleto).forEach(id => {
          if (novosBoleto[id] > 0) {
            novosBoleto[id] -= 1;
          }
        });
        return novosBoleto;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (protocolos.length > 0 && !isBoletoVencidoRunning.current) {
      isBoletoVencidoRunning.current = true;
      boletoVencido().finally(() => {
        isBoletoVencidoRunning.current = false;
      });
    }
  }, [protocolos]);

  const boletoVencido = async () => {
    for (const protocolo of protocolos) {
      if (protocolo.status === "PAGAMENTO_PENDENTE") {
        const dataProtocolo = new Date(protocolo.data_protocolo);
        const diferencaDias = (Date.now() - dataProtocolo.getTime()) / (1000 * 60 * 60 * 24);
        if (diferencaDias >= 4 && protocolo.status !== "CANCELADO") {
          try {
            await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/status/${protocolo.numero_protocolo}`, {
              ...protocolo,
              status: "CANCELADO"
            });
          } catch (error) {
            console.error("Erro ao cancelar o protocolo", error);
          }
        }
      }
    }
  };

  const prazoCor = (prazoConclusao, dataProtocolo) => {
    if (!prazoConclusao || !dataProtocolo) return {};

    const prazo = parseISO(prazoConclusao);
    const dataInicio = parseISO(dataProtocolo);
    const diasRestantes = differenceInDays(prazo, dataInicio);

    // Deixa o prazo mais evidente
    if (diasRestantes <= 3) {
      return { backgroundColor: '#e74c3c', color: 'red' };
    }
    if (diasRestantes <= 8) {
      return { backgroundColor: '#f39c12', color: 'black' };
    }
    return {};
  };

  const handleClick = (id) => {
    navigate(`/protocolo/${id}`);
  };

  const voltarIndex = () => {
    navigate("/");
  };

  const formatarDataHora = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo"
    });
  };

  const getStatusClass = (status) => {
    return `${styles.statusBadge} ${styles[`status${status.replace('PAGAMENTO_', '')}`]}`;
  };

  const toggleFiltro = (status) => {
    setFiltroStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredProtocolos = protocolos?.length > 0
    ? protocolos
      .filter(protocolo =>
        protocolo.numero_protocolo?.toLowerCase().includes(pesquisarProt.toLowerCase())
      )
      .filter(protocolo =>
        filtroStatus.length > 0
          ? filtroStatus.includes(protocolo.status)
          : !["CONCLUIDO", "CANCELADO", "RECUSADO", "PAGAMENTO_PENDENTE"].includes(protocolo.status)
      )
      .sort((a, b) => {
        const prazoA = a.prazoConclusao ? new Date(a.prazoConclusao) : new Date(9999, 11, 31);
        const prazoB = b.prazoConclusao ? new Date(b.prazoConclusao) : new Date(9999, 11, 31);
        return prazoA - prazoB;
      })
    : [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Protocolos</h1>

      <input
        type="text"
        placeholder="Pesquisar por número de protocolo..."
        value={pesquisarProt}
        onChange={(e) => setPesquisarProt(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.filtersContainer}>
        <div className={styles.filtersWrapper}>
          {["CONCLUIDO", "CANCELADO", "RECUSADO", "PAGAMENTO_PENDENTE", "EM_ANDAMENTO"].map(
            (status) => (
              <button
                key={status}
                onClick={() => toggleFiltro(status)}
                className={`${styles.filterButton} ${filtroStatus.includes(status) ? styles.filterButtonActive : ''}`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {filteredProtocolos.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Assunto</th>
              <th>Número</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Valor</th>
              {filtroStatus.length === 0 && <th>Prazo de Conclusão</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProtocolos.map((protocolo) => {
              const prazoStyle = prazoCor(protocolo.prazoConclusao, protocolo.data_protocolo);
              const rowClass = prazoStyle.backgroundColor === '#e74c3c'
                ? styles.rowTableRed
                : prazoStyle.backgroundColor === '#f39c12'
                  ? styles.rowTableYellow
                  : styles.rowTableNormal;

              return (
                <tr
                  key={protocolo.id_protocolo}
                  onClick={() => handleClick(protocolo.id_protocolo)}
                  className={`${styles.rowTable} ${rowClass}`}
                >
                  <td>{protocolo.assunto || 'Não informado'}</td>
                  <td>{protocolo.numero_protocolo || 'N/A'}</td>
                  <td>{formatarDataHora(protocolo.data_protocolo)}</td>
                  <td>{protocolo.descricao || 'Não informado'}</td>
                  <td>
                    <span className={getStatusClass(protocolo.status)}>
                      {protocolo.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{protocolo.valor ? `R$ ${protocolo.valor.toFixed(2)}` : "Grátis"}</td>
                  {filtroStatus.length === 0 && (
                    <td style={{
                      color: prazoStyle.color,
                      fontWeight: prazoStyle.backgroundColor === '#e74c3c' ? 'bold' : 'normal'
                    }}>
                      {protocolo.prazoConclusao ? formatarDataHora(protocolo.prazoConclusao) : "Sem prazo"}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            {pesquisarProt
              ? "Nenhum protocolo encontrado com esse número"
              : filtroStatus.length > 0
                ? "Nenhum protocolo com os filtros selecionados"
                : "Nenhum protocolo em andamento no momento"}
          </p>
        </div>
      )}

      <button className={styles.voltarButton} onClick={voltarIndex}>
        Voltar
      </button>
    </div>
  );
}

export default ListarProtocolosBySecretaria;