import React, { useState, useEffect } from "react";
import axios from 'axios';
import { format } from 'date-fns';
import { FiArrowLeft, FiCheck, FiX, FiDownload, FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import URL from "../../services/url";
import Message from "../../layouts/Message";
import Loading from '../../layouts/Loading';
import styles from './analisarComprovantes.module.css';

function AnalisarComprovantes() {
  const [protocolos, setProtocolos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [type, setType] = useState();
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [termoBusca, setTermoBusca] = useState('');

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  // Configurar token de autenticação
  const token = localStorage.getItem('token');
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    const fetchProtocolosComComprovantes = async () => {
      setIsLoading(true);
      setError(null);
      setMessage(null);
  
      try {
        const response = await axiosInstance.get(`/protoon/protocolo/todos-protocolos`);
        console.log('Resposta completa:', response);
        
        let protocolosData = Array.isArray(response.data) ? response.data : [];
        
        console.log('Protocolos com comprovantes:', protocolosData);
        
        if (protocolosData.length === 0) {
          setMessage('Nenhum protocolo com comprovante encontrado');
          setType('info');
        }
        
        setProtocolos(protocolosData);
        
      } catch (error) {
        console.error('Erro ao buscar os protocolos:', error);
        setError('Erro ao buscar os protocolos. Por favor, tente novamente.');
        setMessage('Erro ao carregar protocolos');
        setType('error');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProtocolosComComprovantes();
  }, []);

  const voltarDashboard = () => {
    navigate("/dashboard-funcionario");
  };

  const handleAtualizarStatus = async (id_comprovante, novoStatus) => {  // Mude o parâmetro para id_comprovante
    try {
        const statusFormatado = novoStatus.toUpperCase();
        const statusValidos = ['APROVADO', 'REPROVADO', 'PENDENTE'];
    
        if (!statusValidos.includes(statusFormatado)) {
            throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`);
        }
    
        const response = await axiosInstance.put(
            `/protoon/comprovantes/${id_comprovante}/status?status=${statusFormatado}`,
            null,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
    
        setProtocolos(prev =>
            prev.map(p =>
                p.comprovante?.id_comprovante === id_comprovante 
                    ? { ...p, comprovante: response.data } 
                    : p
            )
        );
        setMessage(`Status atualizado para ${statusFormatado}`);
        setType('success');
    } catch (error) {
        console.error('Erro detalhado:', error);
        let errorMsg = 'Erro ao atualizar status';
        if (error.response) {
            errorMsg = error.response.data?.error ||
                       error.response.data?.message ||
                       error.response.statusText ||
                       'Erro no servidor';
        } else if (error.request) {
            errorMsg = 'Sem resposta do servidor';
        } else {
            errorMsg = error.message;
        }
        setMessage(errorMsg);
        setType('error');
    }
};
  const formatDateSafely = (dateString) => {
    try {
      if (!dateString) return 'Data não disponível';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Data inválida' : format(date, 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Data inválida';
    }
  };

  const protocolosFiltrados = protocolos.filter(protocolo => {
    // Filtro por status
    if (filtroStatus !== 'TODOS' && protocolo.comprovante?.status !== filtroStatus) {
      return false;
    }
    
    // Filtro por termo de busca (assunto, número do protocolo ou nome do munícipe)
    if (termoBusca) {
      const busca = termoBusca.toLowerCase();
      return (
        (protocolo.assunto?.toLowerCase().includes(busca)) ||
        (protocolo.numero_protocolo?.toLowerCase().includes(busca)) ||
        (protocolo.municipe?.nome?.toLowerCase().includes(busca))
      );
    }
    
    return true;
  });

  const renderComprovanteStatus = (protocolo) => {
    if (!protocolo.comprovante) return null;
    
    const isImage = protocolo.comprovante.tipoArquivo?.startsWith('image/');
    const fileUrl = protocolo.comprovante.urlDownload || protocolo.comprovante.url;
    
    return (
      <div className={styles.comprovanteContainer}>
        {isImage && (
          <div className={styles.comprovanteThumbnail}>
            <img 
              src={fileUrl} 
              alt={`Comprovante ${protocolo.comprovante.nomeArquivo}`}
              className={styles.thumbnailImage}
              onClick={() => window.open(fileUrl, '_blank')}
            />
          </div>
        )}
        
        <div className={styles.comprovanteInfo}>
          <div className={styles.comprovanteMeta}>
            <span className={styles.fileName}>
              {protocolo.comprovante.nomeArquivo}
            </span>
            <span className={styles.fileDate}>
              {formatDateSafely(protocolo.comprovante.dataUpload)}
            </span>
          </div>
          
          <div className={styles.comprovanteActions}>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.comprovanteLink}
              download
            >
              <FiDownload /> Baixar
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderStatusActions = (protocolo) => {
    if (!protocolo.comprovante) return null;
    
    return (
        <div className={styles.statusActions}>
            <button
                className={`${styles.statusButton} ${styles.aprovarButton}`}
                onClick={() => handleAtualizarStatus(protocolo.comprovante.id, 'APROVADO')}
                disabled={protocolo.comprovante?.status === 'APROVADO'}
            >
                <FiCheck /> Aprovar
            </button>
            <button
                className={`${styles.statusButton} ${styles.reprovarButton}`}
                onClick={() => handleAtualizarStatus(protocolo.comprovante.id, 'REPROVADO')}
                disabled={protocolo.comprovante?.status === 'REPROVADO'}
            >
                <FiX /> Reprovar
            </button>
        </div>
    );
};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Análise de Comprovantes</h1>
        
        <div className={styles.filtrosContainer}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por protocolo, assunto ou munícipe..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filtroStatus}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className={styles.statusSelect}
            >
              <option value="TODOS">Todos os status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="APROVADO">Aprovados</option>
              <option value="REPROVADO">Reprovados</option>
            </select>
          </div>
        </div>
      </div>

      {message && <Message type={type} msg={message} />}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableContainer}>
          {protocolosFiltrados.length > 0 ? (
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Protocolo</th>
                  <th className={styles.tableHeader}>Munícipe</th>
                  <th className={styles.tableHeader}>Assunto</th>
                  <th className={styles.tableHeader}>Comprovante</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {protocolosFiltrados.map((protocolo) => (
                  <tr key={protocolo.id_protocolo} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {protocolo.numero_protocolo || 'N/A'}
                    </td>
                    <td className={styles.tableCell}>
                      {protocolo.municipe?.nome || 'Não informado'}
                    </td>
                    <td className={styles.tableCell}>
                      {protocolo.assunto || 'Não informado'}
                    </td>
                    <td className={styles.tableCell}>
                      {renderComprovanteStatus(protocolo)}
                    </td>
                    <td className={styles.tableCell}>
                      <span className={`${styles.statusBadge} ${
                        protocolo.comprovante?.status === 'APROVADO' ? styles.statusApproved :
                        protocolo.comprovante?.status === 'REPROVADO' ? styles.statusRejected :
                        styles.statusPending
                      }`}>
                        {protocolo.comprovante?.status === 'PENDENTE' ? 'Pendente' :
                         protocolo.comprovante?.status === 'APROVADO' ? 'Aprovado' : 'Reprovado'}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {renderStatusActions(protocolo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                {error ? 'Erro ao carregar protocolos' : 'Nenhum protocolo encontrado com os filtros atuais'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={voltarDashboard}
        >
          <FiArrowLeft />
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}

export default AnalisarComprovantes;