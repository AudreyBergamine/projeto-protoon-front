import React, { useState, useEffect } from "react";
import axios from 'axios';
import { format } from 'date-fns';
import { FiArrowLeft, FiInbox } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import URL from '../../services/url';
import Message from '../../layouts/Message';
import Loading from '../../layouts/Loading';
import styles from './consultar.module.css';

function Consultar() {
  const [protocolos, setProtocolos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  // Configurar token de autenticação
  const token = localStorage.getItem('token');
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    const fetchProtocolos = async () => {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      try {
        const response = await axiosInstance.get(`/protoon/protocolo/meus-protocolos/bytoken`);

        if (response.data.length === 0) {
          setMessage('Você ainda não possui protocolos cadastrados');
          setType('info');
        } else {
          setProtocolos(response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar os protocolos:', error);
        setError('Erro ao buscar os protocolos. Por favor, tente novamente.');
        setMessage('Erro ao carregar protocolos');
        setType('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProtocolos();
  }, []);

  const handleClick = (id) => {
    window.open(`/todas-devolutivas/${id}`, '_blank');
  };

  const voltarIndex = () => {
    navigate("/");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 1: return `${styles.statusCell} ${styles.statusActive}`;
      case 2: return `${styles.statusCell} ${styles.statusPending}`;
      case 3: return `${styles.statusCell} ${styles.statusClosed}`;
      default: return styles.statusCell;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Ativo';
      case 2: return 'Pendente';
      case 3: return 'Encerrado';
      default: return status;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meus Protocolos</h1>
      </div>

      {message && <Message type={type} msg={message} />}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableContainer}>
          {protocolos.length > 0 ? (
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Assunto</th>
                  <th className={styles.tableHeader}>Descrição</th>
                  <th className={styles.tableHeader}>Secretaria</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Valor</th>
                  <th className={styles.tableHeader}>Data</th>
                </tr>
              </thead>
              <tbody>
                {protocolos.map((protocolo) => (
                  <tr
                    key={protocolo.id_protocolo}
                    onClick={() => handleClick(protocolo.id_protocolo)}
                    className={styles.tableRow}
                  >
                    <td className={styles.tableCell}>
                      {protocolo.assunto || 'Não informado'}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.descriptionCell} title={protocolo.descricao}>
                        {protocolo.descricao || 'Não informado'}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      {protocolo.secretaria?.nome_secretaria || 'Não informado'}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={getStatusStyle(protocolo.status)}>
                        {getStatusText(protocolo.status)}
                      </span>
                    </td>
                    <td className={`${styles.tableCell} ${styles.valueCell}`}>
                      {protocolo.valor ? `R$ ${parseFloat(protocolo.valor).toFixed(2)}` : 'Grátis'}
                    </td>
                    <td className={styles.tableCell}>
                      {protocolo.data_protocolo
                        ? format(new Date(protocolo.data_protocolo), 'dd/MM/yyyy')
                        : 'Não informado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <FiInbox className={styles.emptyIcon} />
              <p className={styles.emptyText}>Nenhum protocolo encontrado</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={voltarIndex}
        >
          <FiArrowLeft />
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Consultar;