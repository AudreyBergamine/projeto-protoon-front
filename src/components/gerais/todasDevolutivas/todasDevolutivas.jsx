import axios from "axios";
import { useState, useEffect } from "react";
import Loading from '../../layouts/Loading';
import { useParams } from "react-router-dom";
import { FiDownload, FiFile, FiImage, FiZoomIn, FiMessageSquare, FiCalendar, FiUser, FiX } from 'react-icons/fi';
import styles from './todasDevolutivas.module.css';

function TodasDevolutivas() {
  const baseURL = 'http://localhost:8080';
  const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

  const { id } = useParams();
  const [devolutivas, setDevolutivas] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mergedData, setMergedData] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Buscar devolutivas
        const devolutivasResponse = await axiosInstance.get(`/protoon/devolutiva/devolutiva-protocolo/${id}`);
        console.log(devolutivasResponse)
        const devolutivasOrdenadas = devolutivasResponse.data.sort((a, b) =>
          new Date(b.momento_devolutiva) - new Date(a.momento_devolutiva)
        );
        setDevolutivas(devolutivasOrdenadas);

        // Buscar documentos
        const documentosResponse = await axiosInstance.get(`/protoon/documentos/${id}`);
        const documentosOrdenados = documentosResponse.data.sort((a, b) =>
          new Date(b.dataUpload) - new Date(a.dataUpload)
        );
        setDocumentos(documentosOrdenados);

        // Mesclar e ordenar todos os itens por data
        const allItems = [
          ...devolutivasOrdenadas.map(d => ({ ...d, type: 'devolutiva' })),
          ...documentosOrdenados.map(d => ({ ...d, type: 'documento' }))
        ].sort((a, b) => {
          const dateA = a.type === 'devolutiva' ? new Date(a.momento_devolutiva) : new Date(a.dataUpload);
          const dateB = b.type === 'devolutiva' ? new Date(b.momento_devolutiva) : new Date(b.dataUpload);
          return dateB - dateA;
        });

        setMergedData(allItems);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const formatarData = (dataString) => {
    if (!dataString) return 'Data não disponível';

    try {
      // Verifica se já está no formato DD/MM/AAAA HH:MM:SS
      const formatoBrasileiro = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
      const match = dataString.match(formatoBrasileiro);

      if (match) {
        // Se já estiver no formato brasileiro, apenas remove os segundos
        return `${match[1]}/${match[2]}/${match[3]} ${match[4]}:${match[5]}`;
      }

      // Tenta criar a data diretamente (para formato ISO)
      const data = new Date(dataString);

      // Verifica se a data é válida
      if (isNaN(data.getTime())) {
        console.error('Data inválida:', dataString);
        return 'Data inválida';
      }

      // Formata a data
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');

      return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    } catch (error) {
      console.error('Erro ao formatar data:', dataString, error);
      return 'Data inválida';
    }
  };

  const handleDownload = (urlDownload, nomeArquivo) => {
    const link = document.createElement('a');
    link.href = urlDownload;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomImage = (url) => {
    setZoomImage(url);
  };

  const closeZoom = (e) => {
    e.stopPropagation();
    setZoomImage(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FiMessageSquare /> Histórico Completo do Protocolo
      </h1>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.content}>
          {mergedData.length === 0 ? (
            <p className={styles.emptyMessage}>
              Nenhum registro encontrado para este protocolo
            </p>
          ) : (
            <div className={styles.timeline}>
              {mergedData.map((item, index) => (
                <div
                  key={item.type === 'devolutiva' ? `dev-${item.id}` : `doc-${item.id}`}
                  className={`${styles.item} ${item.type === 'devolutiva' ? styles.devolutiva : styles.documento}`}
                >
                  <div className={styles.itemHeader}>
                    <div className={styles.itemType}>
                      {item.type === 'devolutiva' ? (
                        <>
                          <FiMessageSquare className={styles.icon} />
                          <span>Devolutiva</span>
                        </>
                      ) : (
                        <>
                          <FiFile className={styles.icon} />
                          <span>Documento Anexado</span>
                        </>
                      )}
                    </div>
                    <div className={styles.itemDate}>
                      <FiCalendar className={styles.icon} />
                      <span>{formatarData(item.type === 'devolutiva' ? item.momento_devolutiva : item.dataUpload)}</span>
                    </div>
                  </div>

                  {item.type === 'devolutiva' ? (
                    <div className={styles.devolutivaContent}>
                      {item.id_funcionario && (
                        <div className={styles.senderInfo}>
                          <FiUser className={styles.icon} />
                          <span>
                            <strong>Enviado por:</strong> {item.id_funcionario.nome} - {item.id_funcionario.secretaria.nome_secretaria}
                          </span>
                        </div>
                      )}

                      <div className={styles.message}>
                        <p>{item.devolutiva}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.documentContent}>
                      {item.tipoArquivo.startsWith('image') ? (
                        <>
                          <div className={styles.imagePreview}>
                            <img
                              src={item.urlDownload}
                              alt={item.nomeArquivo}
                              onClick={() => handleZoomImage(item.urlDownload)}
                              className={styles.image}
                            />
                            <button
                              onClick={() => handleZoomImage(item.urlDownload)}
                              className={styles.zoomButton}
                            >
                              <FiZoomIn />
                            </button>
                          </div>
                          <div className={styles.documentActions}>
                            <div className={styles.fileInfo}>
                              <FiImage className={styles.icon} />
                              <span>{item.nomeArquivo}</span>
                            </div>
                            <button
                              onClick={() => handleDownload(item.urlDownload, item.nomeArquivo)}
                              className={styles.downloadButton}
                            >
                              <FiDownload className={styles.icon} />
                              <span>Baixar</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className={styles.documentActions}>
                          <div className={styles.fileInfo}>
                            <FiFile className={styles.icon} />
                            <span>{item.nomeArquivo}</span>
                          </div>
                          <button
                            onClick={() => handleDownload(item.urlDownload, item.nomeArquivo)}
                            className={styles.downloadButton}
                          >
                            <FiDownload className={styles.icon} />
                            <span>Baixar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal para zoom da imagem */}
      {zoomImage && (
        <div className={styles.zoomOverlay} onClick={closeZoom}>
          <div className={styles.zoomContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomImage}
              alt="Visualização ampliada"
              className={styles.zoomedImage}
            />
            <button
              onClick={closeZoom}
              className={styles.closeZoomButton}
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodasDevolutivas;