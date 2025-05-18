// Importações de bibliotecas e componentes necessários 
import React, { useState, useEffect, useRef } from "react"; // Hooks do React 
import axios from 'axios'; // Biblioteca usada para fazer requisições HTTP
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
 
  // Instância personalizada da biblioteca axios com base na URL da API e envio de cookies 
  const axiosInstance = axios.create({ 
    baseURL: URL,  // URL base da API
    withCredentials: true, // Permite o envio de cookies com as requisições
  }); 
 
  // Recupera o token do localStorage e define nos headers Authorization do axios 
  // Configurar token de autenticação 
  const token = localStorage.getItem('token'); 
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
 
  // Hook executado quando o componente é montado 
  useEffect(() => { 
    const fetchProtocolos = async () => { 
      setIsLoading(true); // Ativa o loading
      setError(null); // Limpa erro anterior
      setMessage(null); // Limpa mensagem anterior
 
      try { 
        // Requisição para obter os protocolos do usuário via token 
        const response = await axiosInstance.get(`/protoon/protocolo/meus-protocolos/bytoken`); 
        console.log('Resposta completa:', response); 
 
        // Trata os possíveis formatos diferentes que a API pode retornar 
        // Extrai os protocolos da resposta (considerando diferentes estruturas possíveis) 
        let protocolosData = []; 
 
        if (Array.isArray(response.data)) { 
          // Caso 1: a API retorna um array direto 
          protocolosData = response.data; 
        } else if (response.data && Array.isArray(response.data.content)) { 
          // Caso 2: a API use paginação com "content" 
          protocolosData = response.data.content; 
        } else if (response.data && Array.isArray(response.data.protocolos)) { 
          // Caso 3: a resposta venha em um objeto com o array "protocolos" 
          protocolosData = response.data.protocolos; 
        } else if (response.data && typeof response.data === 'object') { 
          // Caso 4: Transforma objeto único em array com 1 único objeto 
          protocolosData = [response.data]; 
        } 
 
        console.log('Protocolos extraídos:', protocolosData); 
 
        // Se não houver protocolos, exibe mensagem 
        if (protocolosData.length === 0) { 
          setMessage('Você ainda não possui protocolos cadastrados'); 
          setType('info'); 
        } else { 
          setMessage(null); // Remove mensagem anterior se houver dados 
        } 
 
        // Salva os protocolos no estado 
        setProtocolos(protocolosData); 
 
      } catch (error) { 
        // Em caso de erro de requisição printa a mensagem 
        console.error('Erro ao buscar os protocolos:', error); 
        setError('Erro ao buscar os protocolos. Por favor, tente novamente.'); 
        setMessage('Erro ao carregar protocolos'); 
        setType('error'); 
        setProtocolos([]); 
      } finally { 
        setIsLoading(false);  // Desativa(Encerra) o loading  
      } 
    }; 
 
    fetchProtocolos();  // Chama função ao montar o componente  
     
  }, []); 
 
  // Abre uma nova aba com as devolutivas do protocolo clicado 
  const handleClick = (id) => { 
    window.open(`/todas-devolutivas/${id}`, '_blank'); 
  }; 
 
  // Navega de volta para a página inicial 
  const voltarIndex = () => { 
    navigate("/"); 
  }; 
 
  // Retorna o estilo CSS baseado no status do protocolo (ativo, pendente, encerrado) 
  // Define o estilo do status do protocolo 
  const getStatusStyle = (status) => { 
    switch (status) { 
      case 1: return `${styles.statusCell} ${styles.statusActive}`; 
      case 2: return `${styles.statusCell} ${styles.statusPending}`; 
      case 3: return `${styles.statusCell} ${styles.statusClosed}`; 
      default: return styles.statusCell; 
    } 
  }; 
 
  // Retorna o texto correspondente ao status numérico do protocolo 
  const getStatusText = (status) => { 
    switch (status) { 
      case 1: return 'Ativo'; 
      case 2: return 'Pendente'; 
      case 3: return 'Encerrado'; 
      default: return status; 
    } 
  }; 
 
  // Atualiza o estado do arquivo selecionado pelo input 
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
 
  // Abre o modal de upload de comprovante para um protocolo específico 
  const openUploadModal = (protocolo) => {  
    setCurrentProtocolo(protocolo); // Define o protocolo atual 
    setShowUploadModal(true); // Mostra o modal 
 
    // Aguarda o modal renderizar antes de rolar até ele (scroll automatico) 
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
 
  // Função que realiza o upload do arquivo selecionado e envia o arquivo para a API 
  const handleUpload = async () => {  
    // Garante que há um arquivo e protocolo selecionado 
    if (!selectedFile || !currentProtocolo) return;  
  
    setUploading(true); // Inicia processo de envio 
  
    const formData = new FormData(); 
    formData.append('file', selectedFile);   // Adiciona o arquivo ao form data (formulário) 
  
    try {  
      // Requisição para enviar o arquivo à API 
      const response = await axiosInstance.post( 
        `/protoon/comprovantes/${currentProtocolo.id_protocolo}`, 
        formData, 
        { 
          headers: { 
            'Content-Type': 'multipart/form-data', 
          }, 
        } 
      ); 
 
      // Exibe mensagem de sucesso e atualiza o comprovante no estado de sucesso 
      setMessage('Comprovante atualizado com sucesso!'); 
      setType('success'); 
 
      // Atualiza a lista de protocolos com o novo comprovante 
      setProtocolos(prev => prev.map(proto => { 
        if (proto.id_protocolo === currentProtocolo.id_protocolo) { 
          return { // retorna o protocolo atualizado 
            ...proto, 
            comprovante: response.data 
          }; 
        } 
        return proto; // retorna o protocolo sem alterações 
      })); 
 
      // Fecha o modal 
      closeUploadModal(); 
    } catch (error) { 
      // Trata possíveis erros e define mensagem apropriada 
      console.error('Erro ao atualizar comprovante:', error); 
      let errorMsg = 'Erro ao atualizar comprovante. Por favor, tente novamente.'; 
 
      // Verifica se o erro é devido ao tamanho do arquivo 
      // e se a resposta contém uma mensagem específica 
      if (error.response) { 
        if (error.response.status === 413) { 
          errorMsg = 'Arquivo muito grande. Tamanho máximo permitido: 10MB'; 
        } else if (error.response.data?.message) { 
          errorMsg = error.response.data.message; 
        } 
      } 
 
      // Exibe mensagem de erro 
      setMessage(errorMsg); 
      setType('error'); 
    } finally { 
      setUploading(false); // Finaliza o processo de envio 
    } 
  }; 
 
  // Renderiza visualmente o botão ou imagem de comprovante para um protocolo 
  const renderComprovanteStatus = (protocolo) => { 
    if (!protocolo.comprovante) { 
      // Se não houver comprovante, mostra botão de anexar 
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
 
    // Verifica se o arquivo é imagem para exibir miniatura 
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
                window.open(fileUrl, '_blank'); // Abre imagem em nova aba 
              }} 
            /> 
            <span className={styles.zoomHint}>Clique para ampliar</span> 
          </div> 
        )} 
           
        {/* Informações do de acordo com o Status do comprovante */} 
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
          {/* Dados do comprovante (atributos) */} 
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

          {/* Ações do comprovante (download e substituir) */}
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

            {/* Botão para substituir o comprovante */}
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

      {/* Mensagem de feedback */}
      {message && <Message type={type} msg={message} />} 
    
      {/* Se estiver carregando, mostra loading */}
      {/* Se houver erro, mostra mensagem de erro */}
      {isLoading ? ( 
        <div className={styles.loadingContainer}> 
          <Loading /> 
        </div> 
      ) : ( 
        <div className={styles.tableContainer}> 
          {Array.isArray(protocolos) && protocolos.length > 0 ? ( 
            // Criando a tabela de protocolos com seus atributos
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
                {protocolos.map((protocolo) => (  // Mapeia os protocolos para criar linhas na tabela
                  // Cada linha representa um protocolo com seus atributos
                  <tr 
                    key={protocolo.id_protocolo} 
                    onClick={() => handleClick(protocolo.id_protocolo)} // Abre devolutivas do protocolo
                    className={styles.tableRow} 
                  > 
                    {/* Informações do protocolo */}
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
            // Se não houver protocolos, mostra mensagem de vazio
            // ou erro
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
        // Modal para anexar comprovante
        // O modal é exibido quando showUploadModal é true
        <div ref={modalRef} className={styles.modalOverlay}> 
          <div className={styles.modalContent}> 
            <h2>Anexar Comprovante</h2> 
            <p>Protocolo: {currentProtocolo.numero_protocolo}</p> 
            <p>Valor: R$ {parseFloat(currentProtocolo.valor).toFixed(2)}</p> 

            {/* Área de upload */}
            <div className={styles.inputGroup} style={{ marginBottom: '50px' }}> 
              <input 
                type="file" 
                id="comprovante-upload" 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png" 
                className={styles.fileInput}
           
              /> 
              <div> 
                {selectedFile && (
                  <div style={{ marginBottom: '50px', color: '#333'}}>
                    <strong>Arquivo selecionado:</strong> {selectedFile.name}
                  </div>
                )}
              </div>
              {/*         
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <FiPaperclip /> Anexar documentos:
                </label>
                  <input
                    type="file"
                    multiple
                    className={styles.fileInput}
                    name="documentos"
                    onChange={handleFileChange}
                  />
        </div> */}
            </div> 

            {/* Botões do modal */}
            <div className={styles.modalButtons} style={{ display: 'flex', justifyContent: 'space-evenly' }}> 
              <button 
                onClick={closeUploadModal} 
                className={styles.button} 
                disabled={uploading}> Cancelar 
              </button> 

              <button 
                onClick={handleUpload} 
                className={styles.button} 
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