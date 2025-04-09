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
  const [pesquisarProt, setPesquisarProt] = useState(''); // Pesquisar protocolos
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [prazoConclusaoSimulado, setPrazoConclusaoSimulado] = useState({}); // Valor inicial em minutos
  const [boletoSimulado, setboletoSimulado] = useState({}); // Valor para vender o boleto em segundos
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
            const response = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/status/${protocolo.numero_protocolo}`, {
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

    if (diasRestantes <= 3) {
      return { backgroundColor: '#e74c3c', color: 'white' }; // Vermelho suave
    }
    if (diasRestantes <= 8) {
      return { backgroundColor: '#f39c12', color: 'black' }; // Amarelo suave
    }
    return {};
  };

  const handleClick = (id) => {
    navigate(`/protocolo/${id}`);
  };

  const voltarIndex = async () => {
    navigate("/");
  }

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

  const toggleFiltro = (status) => {
    setFiltroStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

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
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          {["CONCLUIDO", "CANCELADO", "RECUSADO", "PAGAMENTO PENDENTE"].map(
            (status) => (
              <button
                key={status}
                onClick={() => toggleFiltro(status)}
                className={`${styles.filterButton} ${filtroStatus.includes(status) ? styles.filterButtonActive : ''}`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>
      <table className={styles.table}>
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
          </tr>
        </thead>
        <tbody>
          {filteredProtocolos.map((protocolo, index) => {
            const prazoStyle = prazoCor(protocolo.prazoConclusao, protocolo.data_protocolo);
            return (
              <React.Fragment key={protocolo.id_protocolo}>
                <tr onClick={() => handleClick(protocolo.id_protocolo)} className={`${styles.rowTable} ${prazoStyle.backgroundColor === '#e74c3c' ? styles.rowTableRed : prazoStyle.backgroundColor === '#f39c12' ? styles.rowTableYellow : styles.rowTableNormal}`}>
                  <td>{protocolo.assunto}</td>
                  <td>{protocolo.numero_protocolo}</td>
                  <td>{formatarDataHora(protocolo.data_protocolo)}</td>
                  <td>{protocolo.descricao}</td>
                  <td>{protocolo.status}</td>
                  <td>{protocolo.valor ? `R$ ${protocolo.valor.toFixed(2)}` : ""}</td>
                  {filtroStatus.length === 0 && (
                    <td>{protocolo.prazoConclusao ? new Date(protocolo.prazoConclusao).toLocaleDateString('pt-BR') : ""}</td>
                  )}
                </tr>
                {index !== filteredProtocolos.length - 1 && <tr><td colSpan="6"><hr /></td></tr>}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <button className={styles.voltarButton} onClick={voltarIndex}>Voltar</button>
    </div>
  );
}

export default ListarProtocolosBySecretaria;
