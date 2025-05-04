// Importações de bibliotecas e componentes necessários
import React, { useState, useEffect, useRef } from "react"; // Hooks do React
import axios from 'axios'; // Cliente HTTP
import { format } from 'date-fns'; // Biblioteca para formatar datas
import { FiArrowLeft, FiInbox, FiPaperclip, FiCheck, FiX, FiRefreshCw, FiDownload } from 'react-icons/fi'; // Ícones do pacote react-icons
import { useNavigate } from "react-router-dom"; // Hook para navegação
import URL from '../../services/url'; // URL base da API
import Message from '../../layouts/Message'; // Componente de mensagens
import Loading from '../../layouts/Loading'; // Componente de loading
import styles from './consultar.module.css'; // Estilos CSS em módulo

// Componente principal da página
function Consultar() {
   // Estados da aplicação
  const [protocolos, setProtocolos] = useState([]); // Lista de protocolos
  const [isLoading, setIsLoading] = useState(true); // Indica se está carregando
  const [error, setError] = useState(null); // Armazena erro (se houver)
  const navigate = useNavigate();  // Para navegação entre páginas
  const [message, setMessage] = useState();  // Mensagem informativa
  const [type, setType] = useState();  // Tipo da mensagem ('success', 'error', etc)
  const [selectedFile, setSelectedFile] = useState(null); // Arquivo selecionado
  const [uploading, setUploading] = useState(false); // Flag de envio de arquivo
  const [currentProtocolo, setCurrentProtocolo] = useState(null); // Protocolo atual em foco
  const [showUploadModal, setShowUploadModal] = useState(false); // Controle do modal
  const modalRef = useRef(null); // Referência para scroll até o modal

   // Instância do axios com configurações padrão
  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  // Recupera o token do localStorage e define nos headers da instância axios
  // Configurar token de autenticação
  const token = localStorage.getItem('token');
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // Hook useEffect executado ao montar o componente
  useEffect(() => {
    const fetchProtocolos = async () => {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      try {
        // Requisição para buscar os protocolos do usuário
        const response = await axiosInstance.get(`/protoon/protocolo/meus-protocolos/bytoken`);
        console.log('Resposta completa:', response);

        // Normaliza o formato dos dados recebidos (independente do formato da API)
        // Extrai os protocolos da resposta (considerando diferentes estruturas possíveis)
        let protocolosData = [];

        if (Array.isArray(response.data)) {
          // Caso 1: A API retorna um array diretamente
          protocolosData = response.data;
        } else if (response.data && Array.isArray(response.data.content)) {
          // Caso 2: Resposta paginada (content contém o array)
          protocolosData = response.data.content;
        } else if (response.data && Array.isArray(response.data.protocolos)) {
          // Caso 3: Resposta com objeto que contém array protocolos
          protocolosData = response.data.protocolos;
        } else if (response.data && typeof response.data === 'object') {
          // Caso 4: Transforma objeto único em array com 1 elemento
          protocolosData = [response.data];
        }

        console.log('Protocolos extraídos:', protocolosData);

         // Exibe mensagem se nenhum protocolo for encontrado
        if (protocolosData.length === 0) {
          setMessage('Você ainda não possui protocolos cadastrados');
          setType('info');
        } else {
          setMessage(null); // Remove mensagem anterior se houver dados
        }

         // Atualiza o estado
        setProtocolos(protocolosData);

      } catch (error) {
        // Trata erros de requisição
        console.error('Erro ao buscar os protocolos:', error);
        setError('Erro ao buscar os protocolos. Por favor, tente novamente.');
        setMessage('Erro ao carregar protocolos');
        setType('error');
        setProtocolos([]);
      } finally {
        setIsLoading(false);  // Encerra loading
      }
    };

    fetchProtocolos();  // Chama função ao montar


  }, []);

  // Abre nova aba com as devolutivas do protocolo
  const handleClick = (id) => {
    window.open(`/todas-devolutivas/${id}`, '_blank');
  };

  // Navega de volta para a página inicial
  const voltarIndex = () => {
    navigate("/");
  };

  // Define classes de estilo com base no status do protocolo
  const getStatusStyle = (status) => {
    switch (status) {
      case 1: return `${styles.statusCell} ${styles.statusActive}`;
      case 2: return `${styles.statusCell} ${styles.statusPending}`;
      case 3: return `${styles.statusCell} ${styles.statusClosed}`;
      default: return styles.statusCell;
    }
  };

  // Retorna texto de status do protocolo
  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Ativo';
      case 2: return 'Pendente';
      case 3: return 'Encerrado';
      default: return status;
    }
  };

  // Atualiza o arquivo selecionado
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Formata datas de forma segura (evita erros se a data for inválida)
  const formatDateSafely = (dateString) => {
    try {
      if (!dateString) return 'Data não disponível';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Data inválida' : format(date, 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Data inválida';
    }
  };

  // Abre modal de envio de comprovante
  const openUploadModal = (protocolo) => {
    setCurrentProtocolo(protocolo);
    setShowUploadModal(true);

    // Faz scroll automático até o modal
    // Adicione um pequeno timeout para garantir que o modal esteja renderizado
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Fecha modal e limpa estados relacionados
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setCurrentProtocolo(null);
  };

  // Envia o arquivo para a API
  const handleUpload = async () => {
    if (!selectedFile || !currentProtocolo) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);  // Adiciona o arquivo

    try {
      const response = await axiosInstance.post( // Mude para PUT para indicar atualização
        `/protoon/comprovantes/${currentProtocolo.id_protocolo}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Mensagem de sucesso e atualização da lista
      setMessage('Comprovante atualizado com sucesso!');
      setType('success');

      // Atualiza o comprovante do protocolo alterado
      // Atualiza o protocolo específico
      setProtocolos(prev => prev.map(proto => {
        if (proto.id_protocolo === currentProtocolo.id_protocolo) {
          return {
            ...proto,
            comprovante: response.data
          };
        }
        return proto;
      }));

      closeUploadModal();
    } catch (error) {
      console.error('Erro ao atualizar comprovante:', error);
      let errorMsg = 'Erro ao atualizar comprovante. Por favor, tente novamente.';

      if (error.response) {
        if (error.response.status === 413) {
          errorMsg = 'Arquivo muito grande. Tamanho máximo permitido: 10MB';
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        }
      }

      setMessage(errorMsg);
      setType('error');
    } finally {
      setUploading(false);
    }
  };

  // Renderiza visualmente o status do comprovante
  const renderComprovanteStatus = (protocolo) => {
    if (!protocolo.comprovante) {
      return (
        <button
          className={styles.buttonAnexar}
          onClick={(e) => {
            e.stopPropagation();
            openUploadModal(protocolo);
          }}
        >
          <FiPaperclip /> Anexar
        </button>
      );
    }

    const isImage = protocolo.comprovante.tipoArquivo?.startsWith('image/');
    const fileUrl = protocolo.comprovante.urlDownload || protocolo.comprovante.url;

    return (
      <div className={styles.comprovanteContainer}>
        {/* Miniatura da imagem (se for um arquivo de imagem) */}
        {isImage && (
          <div className={styles.comprovanteThumbnail}>
            <img
              src={fileUrl}
              alt={`Comprovante ${protocolo.comprovante.nomeArquivo}`}
              className={styles.thumbnailImage}
              onClick={(e) => {
                e.stopPropagation();
                window.open(fileUrl, '_blank');
              }}
            />
            <span className={styles.zoomHint}>Clique para ampliar</span>
          </div>
        )}

        {/* Informações do comprovante */}
        <div className={styles.comprovanteInfo}>
          <div className={styles.comprovanteStatus}>
            {protocolo.comprovante.status === 'PENDENTE' && (
              <span className={styles.comprovantePending}>
                Em análise
              </span>
            )}
            {protocolo.comprovante.status === 'APROVADO' && (
              <span className={styles.comprovanteApproved}>
                <FiCheck /> Aprovado
              </span>
            )}
            {protocolo.comprovante.status === 'REPROVADO' && (
              <span className={styles.comprovanteRejected}>
                <FiX /> Reprovado
              </span>
            )}
          </div>

          <div className={styles.comprovanteMeta}>
            <span className={styles.fileName}>
              {protocolo.comprovante.nomeArquivo}
            </span>
            <span className={styles.fileSize}>
              {(protocolo.comprovante.tamanhoArquivo / 1024).toFixed(2)} KB
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
              onClick={(e) => e.stopPropagation()}
              download
            >
              <FiDownload /> Baixar
            </a>
            <button
              className={styles.replaceButton}
              onClick={(e) => {
                e.stopPropagation();
                openUploadModal(protocolo);
              }}
            >
              <FiRefreshCw /> Substituir
            </button>
          </div>
        </div>
      </div>
    );
  };

  // JSX que define o layout visual do componente
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
          {Array.isArray(protocolos) && protocolos.length > 0 ? (
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Assunto</th>
                  <th className={styles.tableHeader}>Descrição</th>
                  <th className={styles.tableHeader}>Secretaria</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Valor</th>
                  <th className={styles.tableHeader}>Comprovante</th>
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
                    {protocolo.status === 'PAGAMENTO_PENDENTE' ? (<td className={styles.tableCell}>
                      {renderComprovanteStatus(protocolo)}
                    </td>) : (<td> </td>)}
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
              <p className={styles.emptyText}>
                {error ? 'Erro ao carregar protocolos' : 'Nenhum protocolo encontrado'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de upload */}
      {showUploadModal && (
        <div ref={modalRef} className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Anexar Comprovante</h2>
            <p>Protocolo: {currentProtocolo.numero_protocolo}</p>
            <p>Valor: R$ {parseFloat(currentProtocolo.valor).toFixed(2)}</p>

            <div className={styles.uploadArea}>
              <input
                type="file"
                id="comprovante-upload"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className={styles.fileInput}
              />
              <label htmlFor="comprovante-upload    " className={styles.fileLabel}>
                {selectedFile ? selectedFile.name : '     Selecione o comprovante'}
              </label>
            </div>

            <div className={styles.modalButtons}>
              <button
                onClick={closeUploadModal}
                className={styles.button}
                disabled={uploading}> Cancelar
              </button>

              <button
                onClick={handleUpload}
                className={styles.uploadButton}
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Enviando...' : 'Enviar Comprovante'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button
          className={styles.secondaryButton}
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