import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message'
import URL from '../../services/url';
import TodasDevolutivas from "../todasDevolutivas/todasDevolutivas";
import ConfirmationDialog from '../../layouts/ConfirmationDialog';
import styles from './analisarProtocolos.module.css';
import { FiArrowLeft, FiInbox, FiPaperclip } from 'react-icons/fi';

function AnalisarProtocolos() {
  const navigate = useNavigate()
  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });
  const token = localStorage.getItem('token');
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const [devolutiva, setDevolutiva] = useState('');
  const [protocolo, setProtocolo] = useState(null);
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [valorSelecionado, setValorSelecionado] = useState();
  const [oldValor, setOldValor] = useState(40);
  const [oldSecretaria, setOldSecretaria] = useState();
  const [secretarias, setSecretarias] = useState([]);
  const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");
  const [message, setMessage] = useState()
  const [type, setType] = useState()
  const [removeLoading, setRemoveLoading] = useState(true)
  const [devolutivaMaisRecente, setDevolutivaMaisRecente] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [enviandoDevolutiva, setEnviandoDevolutiva] = useState(false);
  const [mensagemAtiva, setMensagemAtiva] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalDoc, setMostrarModalDoc] = useState(false);
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [motivoConfirmado, setMotivoConfirmado] = useState(false);
  const [imagens, setImagens] = useState([]);
  const [imagemZoom, setImagemZoom] = useState(null);
  const [arquivos, setArquivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [enviandoImagens, setEnviandoImagens] = useState(false);




  const { id } = useParams();
  const role = localStorage.getItem('role')

  const HistoricoDevolutivas = () => {
    window.open(`/todas-devolutivas/${id}`, '_blank');
  };

  useEffect(() => {
    async function fetchProtocolo() {
      try {
        if (localStorage.getItem('role') === 'FUNCIONARIO' || localStorage.getItem('role') === 'COORDENADOR') {
          const response1 = await axiosInstance.get('/protoon/secretaria');
          setSecretarias(response1.data);
        }
        const response2 = await axiosInstance.get(`/protoon/protocolo/pesquisar-id/${id}`);
        setProtocolo(response2.data);
        setStatusSelecionado(response2.data.status);
        setOldValor(response2.data.valor);
        setOldSecretaria(response2.data.secretaria ? response2.data.secretaria.id_secretaria : null);
        const devolutivasResponse = await axiosInstance.get(`/protoon/devolutiva/devolutiva-protocolo/${id}`);
        const devolutivas = devolutivasResponse.data;

        if (devolutivas.length > 0) {
          devolutivas.sort((a, b) => b.momento_devolutiva.localeCompare(a.momento_devolutiva));
          setDevolutivaMaisRecente(devolutivas[0]);
        }

      } catch (error) {
        console.error('Erro ao buscar o protocolo:', error);
      }
    }
    fetchProtocolo();
  }, [id]);

  const voltarAnterior = async () => {
    navigate('/protocolos')
  }

  const enviarDevolutiva = (event) => {
    setDevolutiva(event.target.value);
  };

  const novaDevolutiva = async () => {
    if (!devolutiva || devolutiva.trim() === '') {
      if (exibirMensagem) {
        exibirMensagem("Campo de descrição vazio. Não é possível enviar a devolutiva.", 'error');
        return;
      }
    }

    if (protocolo.status === "RECUSADO" && !motivoConfirmado) {
      setMostrarModal(true);
      return;
    }

    try {
      setEnviandoDevolutiva(true);
      const response = await axiosInstance.post(`/protoon/devolutiva/criar-devolutiva/${id}`, { devolutiva });
      salvarAlteracoes()
      setTimeout(() => {
        setDevolutiva('');
        navigate(`/protocolo/${id}`);
        exibirMensagem("Devolutiva Enviada com Sucesso!", 'success');
      }, 3000);
    } catch (error) {
      exibirMensagem("Erro ao enviar a devolutiva. Por favor, tente novamente mais tarde.", 'error');
      console.error('Erro ao enviar a devolutiva:', error);
    } finally {
      setEnviandoDevolutiva(false);
    }
  };

  const exibirMensagem = (msg, tipo) => {
    setMessage(msg);
    setType(tipo);
    setMensagemAtiva(true);
    setTimeout(() => {
      setMessage('');
      setType('');
      setMensagemAtiva(false);
    }, 3000);
  };

  const updateProtocolo = async () => {
    try {
      if (!devolutiva || devolutiva.trim() === '') {
        if (exibirMensagem) {
          exibirMensagem("Campo de descrição de Devolutiva vazio. Não é possível atualizar status.", 'error');
          return;
        }
      }

      const response = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/status/${protocolo.numero_protocolo}`, {
        ...protocolo,
        status: statusSelecionado
      });
      if (response.status.valueOf() === 200) {
        setRemoveLoading(false)
        setTimeout(() => {
          setRemoveLoading(true)
        }, 2000)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Erro ao atualizar o protocolo:', error);
    }
  }

  const redirectProtocolo = async () => {
    setShowConfirmationDialog(true);
  }

  const solicitarRedirecionar = async () => {
    try {
      if (idSecretariaSelecionada === null || idSecretariaSelecionada === undefined) {
        setMessage('Secretaria não definida para este protocolo.');
        setType('error');
        return;
      }

      const response1 = await axiosInstance.get(`/protoon/secretaria/${idSecretariaSelecionada}`);
      const secretariaData = response1.data;

      if (!secretariaData || !secretariaData.nome_secretaria) {
        setMessage('Secretaria não encontrada.');
        setType('error');
        return;
      }

      const response2 = await axiosInstance.post(`/protoon/redirecionamento/${id}`, {
        novaSecretaria: secretariaData.nome_secretaria,
      });

      if (response2.status.valueOf() === 201) {
        setRemoveLoading(false);
        setTimeout(() => {
          setRemoveLoading(true);
          setMessage('Solicitação de redirecionamento feita com Sucesso!');
          setType('success');
          setTimeout(() => {
            setMessage('');
            navigate('/protocolos');
          }, 2000);
        }, 2000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        setMessage('Erro desconhecido ocorreu.');
        console.log('Erro desconhecido ocorreu.');
      }
    }
  };

  const redirecionar = async () => {
    if (ConfirmationDialog) {
      setShowConfirmationDialog(false)
      try {
        const response1 = await axiosInstance.get(`/protoon/secretaria/${idSecretariaSelecionada}`)
        const secretariaData = response1.data;

        const response2 = await axiosInstance.post(`/protoon/redirecionamento/${id}`,
          { novaSecretaria: secretariaData.nome_secretaria }
        )

        console.log("secretarias: " + oldSecretaria + " - " + idSecretariaSelecionada)
        if (oldSecretaria != idSecretariaSelecionada) {
          const response3 = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/departamento/${protocolo.numero_protocolo}`, {
            ...protocolo,
            secretaria: secretariaData
          });

          if (response3) {
            setRemoveLoading(false)
            setTimeout(() => {
              setRemoveLoading(true)
              setMessage('Redirecionamento feito com Sucesso!')
              setType('success')
              setTimeout(() => {
                setMessage('')
                navigate('/protocolos');
              }, 2000)
            }, 2000)
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          setRemoveLoading(false)
          setTimeout(() => {
            setRemoveLoading(true)
            setMessage('Você está tentando redirecionar para a mesma Secretaria!')
            setType('error')
            navigate('/protocolo/' + id);
          }, 2000)
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
          console.log(error.response.data.message);
        } else {
          setMessage('Erro desconhecido ocorreu.');
          console.error('Erro desconhecido ocorreu. ' + error);
        }
      }
    }
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

  const handleSecretariaChange = (e) => {
    const selectedSecretariaId = e.target.value;
    setIdSecretariaSelecionada(selectedSecretariaId);
  };

  const handleStatusChange = (e) => {
    const novoStatus = e.target.value;
    setStatusSelecionado(novoStatus);
    setProtocolo(prevProtocolo => ({
      ...prevProtocolo,
      status: novoStatus
    }));
  };

  if (!protocolo) {
    return <Loading />;
  }

  const salvarAlteracoes = async () => {
    if (isSubmitting) {
      console.log("Duplo Click detectado!")
      return;
    }
    setIsSubmitting(true)

    if (protocolo.assunto === 'Outros' && protocolo.valor !== null) {
      if (oldValor !== valorSelecionado && valorSelecionado != null) {
        SalvarNovoValor(valorSelecionado)
      }
    }
    setTimeout(() => setIsSubmitting(false), 1000);
    if (enviandoDevolutiva || mensagemAtiva) {
      return;
    }

    setMensagemAtiva(true);
    try {
      setTimeout(() => {
        setRemoveLoading(true)
        updateProtocolo();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        exibirMensagem("Protocolo atualizado com Sucesso!", 'success');
        setTimeout(() => {
          navigate('/protocolos');
        }, 2000)
      }, 3000)
      setRemoveLoading(false)

    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    } finally {
      setMensagemAtiva(false);
    }
  };

  const handleCancelRedirect = () => {
    setShowConfirmationDialog(false);
  }

  const handleValorChange = (e) => {
    const novoValor = parseFloat(e.target.value);
    setValorSelecionado(novoValor)
    setProtocolo(prevProtocolo => ({
      ...prevProtocolo,
      valor: novoValor,
    }));
  };

  const SalvarNovoValor = async (valorSelecionado) => {
    const response3 = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/valor/${protocolo.numero_protocolo}`, {
      ...protocolo,
      valor: valorSelecionado
    });
  }

  const handleConfirmarMotivo = () => {
    if (motivoRecusa) {
      novaDevolutiva()
      setMotivoConfirmado(true);
      setMostrarModal(false);
    } else {
      alert("Selecione um motivo para a recusa!");
    }
  }

  const enviarImagens = async () => {
    if (arquivos.length > 0) {
      const formDataFiles = new FormData();
      arquivos.forEach(file => formDataFiles.append("files", file));

      try {
        setEnviandoImagens(true); // Habilita o carregamento enquanto envia as imagens
        await axiosInstance.post(`/protoon/documentos/${protocolo.id_protocolo}/multiplos`, formDataFiles, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        // Caso a resposta seja bem-sucedida
        exibirMensagem("Imagens enviadas com sucesso!", 'success');
      } catch (error) {
        console.error('Erro ao enviar documentos:', error);
        exibirMensagem('Falha ao enviar as imagens. Tente novamente mais tarde.', 'error');
      } finally {
        setEnviandoImagens(false); // Desabilita o carregamento quando terminar
      }
    }
  };

  const buscarImagens = async () => {
    try {
      console.log(protocolo.id_protocolo);

      const response = await axiosInstance.get(`/protoon/documentos/${protocolo.id_protocolo}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      // Usa a URL de download correta para exibir no <img>
      const imagensExtraidas = response.data
        .filter(doc => doc.tipoArquivo.startsWith("image")) // filtra só imagens
        .map(doc => doc.urlDownload);

      setImagens(imagensExtraidas);
      setMostrarModalDoc(true);
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
    }
  };






  const motivosRecusa = [
    "Documentação incompleta",
    "Dados inconsistentes",
    "Requerimentos não atendidos",
    "Erro no preenchimento",
    "Outro"
  ];


  return (
    <>
      {message ? <div className={styles.messageContainer}><Message type={type} msg={message} /></div> :
        <div className={styles.container}>
          <h1>Detalhes do Protocolo</h1>

          {(role === "COORDENADOR" || role === "FUNCIONARIO") && (
            <div className={styles.secretariaContainer}>
              <h3>Secretaria</h3>
              <select
                className={styles.secretariaSelect}
                value={idSecretariaSelecionada}
                onChange={handleSecretariaChange}
              >
                <option value="">Selecione a secretaria</option>
                {secretarias
                  .filter(secretaria =>
                    !protocolo.secretaria || secretaria.nome_secretaria !== protocolo.secretaria.nome_secretaria)
                  .map(secretaria => (
                    <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                      {secretaria.nome_secretaria}
                    </option>
                  ))}
              </select>
              {role === "FUNCIONARIO" ? (
                <button className={styles.btnLog} onClick={solicitarRedirecionar}>Solicitar Redirecionamento Protocolo</button>
              ) : (
                <button className={styles.btnLog} onClick={redirectProtocolo}>Redirecionar Protocolo</button>
              )}

              {!removeLoading && <Loading />}

              {showConfirmationDialog && (<ConfirmationDialog
                message="Tem certeza que deseja redirecionar o protocolo?"
                onConfirm={redirecionar}
                onCancel={handleCancelRedirect}
              />)}
            </div>
          )}

          <fieldset className={styles.protocoloFieldset}>
            <legend className={styles.fieldsetLegend}>Protocolo</legend>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Assunto</th>
                  <th>Número</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Alterar Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{protocolo.assunto}</td>
                  <td>{protocolo.numero_protocolo}</td>
                  <td>{formatarDataHora(protocolo.data_protocolo)}</td>
                  <td>
                    {protocolo.assunto === "Outros" && protocolo.valor !== null ? (
                      <select
                        value={protocolo.valor.toFixed(2)}
                        onChange={handleValorChange}
                      >
                        <option value="30.00">R$ 30,00</option>
                        <option value="130.00">R$ 130,00</option>
                        <option value="150.00">R$ 150,00</option>
                      </select>
                    ) : (
                      protocolo.valor !== null && protocolo.valor !== undefined
                        ? `R$ ${protocolo.valor.toFixed(2)}`
                        : "Sem valor"
                    )}
                  </td>
                  <td>
                    <select
                      value={statusSelecionado}
                      onChange={handleStatusChange}
                    >
                      <option value="PAGAMENTO_PENDENTE">PAGAMENTO PENDENTE</option>
                      <option value="CIENCIA">CIÊNCIA</option>
                      <option value="CIENCIA_ENTREGA">CIÊNCIA ENTREGA</option>
                      <option value="CONCLUIDO">CONCLUÍDO</option>
                      <option value="RECUSADO">RECUSADO</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          <fieldset className={styles.descricaoFieldset}>
            <legend className={styles.fieldsetLegend}>
              Descrição do problema
              <button
                type="button"
                className={styles.clipButton}
                onClick={buscarImagens}
                title="Ver anexos"
              >
                <FiPaperclip size={18} />
              </button>
              - Anexos
            </legend>

            <div className={styles.descricaoContainer}>
              {protocolo.descricao}
            </div>
          </fieldset>



          {devolutivaMaisRecente && (
            <fieldset className={styles.devolutivaFieldset}>
              <legend className={styles.fieldsetLegend}>Devolutiva Mais Recente</legend>
              <table className={styles.table}>
                <thead>
                  <td><p>Data e Hora</p></td>
                  <td><p>Funcionário</p></td>
                  <td><p>Secretaria</p></td>
                </thead>
                <tbody>
                  <tr>
                    <td>{devolutivaMaisRecente.momento_devolutiva ? devolutivaMaisRecente.momento_devolutiva : 'N/A'}</td>
                    <td>{devolutivaMaisRecente.id_funcionario && devolutivaMaisRecente.id_funcionario.nome ? devolutivaMaisRecente.id_funcionario.nome : 'N/A'}</td>
                    <td>{devolutivaMaisRecente.id_funcionario && devolutivaMaisRecente.id_funcionario.secretaria.nome_secretaria ? devolutivaMaisRecente.id_funcionario.secretaria.nome_secretaria : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
              <div className={styles.devolutivaTexto}>
                <p>
                  {devolutivaMaisRecente.devolutiva ? devolutivaMaisRecente.devolutiva : 'N/A'}
                </p>
              </div>
              <button onClick={HistoricoDevolutivas} style={{ width: '150px' }}>Historico de devolutivas</button>
            </fieldset>
          )}

          {protocolo.secretaria ? (
            <fieldset className={styles.secretariaFieldset}>
              <legend className={styles.fieldsetLegend}>Secretaria</legend>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <td><p>Nome</p></td>
                    <td><p>Responsável</p></td>
                    <td><p>Email</p></td>
                    <td><p>Endereço</p></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{protocolo.secretaria.nome_secretaria}</td>
                    <td>{protocolo.secretaria.nome_responsavel}</td>
                    <td>{protocolo.secretaria.email}</td>
                    <td>
                      {protocolo.secretaria.endereco.logradouro}, {protocolo.secretaria.endereco.num_endereco}, {protocolo.secretaria.endereco.complemento}, {protocolo.secretaria.endereco.bairro}, {protocolo.secretaria.endereco.cidade} - {protocolo.secretaria.endereco.estado}, {protocolo.secretaria.endereco.pais}
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          ) : null}

          <fieldset className={styles.municipeFieldset}>
            <legend className={styles.fieldsetLegend}>Municipe</legend>
            <table className={styles.table}>
              <thead>
                <td><p>Nome</p></td>
                <td><p>Email</p></td>
                <td><p>CPF</p></td>
                <td><p>Data de Nascimento</p></td>
                <td><p>Celular</p></td>
                <td><p>Endereço</p></td>
              </thead>
              <tbody>
                <tr>
                  <td>{protocolo.municipe.nome}</td>
                  <td>{protocolo.municipe.email}</td>
                  <td>{protocolo.municipe.num_CPF}</td>
                  <td>{protocolo.municipe.data_nascimento}</td>
                  <td>{protocolo.municipe.celular}</td>
                  <td>{protocolo.municipe.endereco.logradouro}, {protocolo.municipe.endereco.num_endereco}, {protocolo.municipe.endereco.complemento}, {protocolo.municipe.endereco.bairro}, {protocolo.municipe.endereco.cidade} - {protocolo.municipe.endereco.estado}, {protocolo.municipe.endereco.pais}</td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          <fieldset className={styles.enderecoFieldset}>
            <legend className={styles.fieldsetLegend}>Endereço do Protocolo</legend>
            <table className={styles.table}>
              <thead>
                <td><p>CEP</p></td>
                <td><p>Logradouro</p></td>
                <td><p>Número</p></td>
                <td><p>Complemento</p></td>
                <td><p>Bairro</p></td>
                <td><p>Cidade</p></td>
                <td><p>Estado</p></td>
                <td><p>País</p></td>
              </thead>
              <tbody>
                <tr>
                  <td>{protocolo.endereco.num_cep}</td>
                  <td>{protocolo.endereco.logradouro}</td>
                  <td>{protocolo.endereco.num_endereco}</td>
                  <td>{protocolo.endereco.complemento}</td>
                  <td>{protocolo.endereco.bairro}</td>
                  <td>{protocolo.endereco.cidade}</td>
                  <td>{protocolo.endereco.estado}</td>
                  <td>{protocolo.endereco.pais}</td>
                </tr>
              </tbody>
            </table>
          </fieldset>

          <fieldset className={styles.uploadContainer}>
            <label className={styles.uploadLabel}>
              Anexar imagens (opcional):
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setArquivos(files);
                  setPreviews(files.map(file => window.URL.createObjectURL(file)));
                }}
                className={styles.uploadInput}
              />
            </label>

            {previews.length > 0 && (
              <div className={styles.previewGrid}>
                {previews.map((preview, idx) => (
                  <img
                    key={idx}
                    src={preview}
                    alt={`preview-${idx}`}
                    className={styles.previewImage}
                    onClick={() => setImagemZoom(preview)}
                  />
                ))}
              </div>
            )}
          </fieldset>


          <fieldset className={styles.devolutivaFieldset}>
            <legend className={styles.fieldsetLegend}>Escreva sua devolutiva</legend>
            <div className={styles.devolutivaTextareaContainer}>
              <textarea
                className={styles.devolutivaTextarea}
                value={devolutiva}
                onChange={enviarDevolutiva}
                placeholder="Digite sua devolutiva para poder enviar as alterações..."
              />
            </div>
            {!devolutiva || devolutiva.trim() !== '' && removeLoading && (<button
              onClick={() => {
                novaDevolutiva();
                if (arquivos.length > 0) {
                  enviarImagens();
                }
              }} disabled={enviandoDevolutiva || mensagemAtiva || enviandoImagens}>
              {enviandoDevolutiva || enviandoImagens? 'Enviando...' : 'Enviar Devolutiva'}
            </button>)}
            {!removeLoading && <Loading />}
          </fieldset>

          {removeLoading && (
            <>

              <div className={styles.buttonContainer}>
                <button
                  className={styles.buttonBack}
                  onClick={voltarAnterior}
                >
                  <FiArrowLeft />
                  Voltar
                </button>
              </div>
            </>
          )}

        </div >
      }
      <div>
        {/* Modal de Motivo de Recusa */}
        {mostrarModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Motivo da Recusa</h2>
              <select
                className={styles.modalSelect}
                value={motivoRecusa}
                onChange={(e) => setMotivoRecusa(e.target.value)}
              >
                <option value="">Selecione um motivo</option>
                {motivosRecusa.map((motivo, index) => (
                  <option key={index} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
              <div className={styles.modalButtons}>
                <button onClick={handleConfirmarMotivo}>Confirmar</button>
                <button onClick={() => setMostrarModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Visualização de Imagens */}
        {mostrarModalDoc && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Imagens do Protocolo</h2>
              <div className={styles.imagensGrid}>
                {imagens.length > 0 ? (
                  imagens.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`imagem-${index}`}
                      className={styles.imagemItem}
                      onClick={() => setImagemZoom(url)}
                    />
                  ))
                ) : (
                  <p>Nenhuma imagem encontrada.</p>
                )}
              </div>
              <div className={styles.modalButtons}>
                <button onClick={() => setMostrarModalDoc(false)}>Fechar</button>
              </div>
            </div>
          </div>
        )}

      </div>
      {imagemZoom && (
        <div className={styles.zoomOverlay} onClick={() => setImagemZoom(null)}>
          <img src={imagemZoom} alt="Imagem em zoom" className={styles.zoomedImage} />
          <button className={styles.closeZoom} onClick={() => setImagemZoom(null)}>×</button>
        </div>
      )}

    </>
  );
}
export default AnalisarProtocolos;