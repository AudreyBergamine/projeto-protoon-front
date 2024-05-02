
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from '../layouts/Loading';
import Message from '../layouts/Message'
import URL from '../services/url';

function AnalisarProtocolos() {
  const navigate = useNavigate()
  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });
  const [protocolo, setProtocolo] = useState(null);
  const [statusSelecionado, setStatusSelecionado] = useState(""); // Estado para armazenar o status selecionado
  const [secretarias, setSecretarias] = useState([]);
  const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");
  const [message, setMessage] = useState()
  const [type, setType] = useState()
  const [removeLoading, setRemoveLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState(""); // Estado para armazenar a mensagem de sucesso
  const [redirected, setRedirected] = useState(false);

  const { id } = useParams();
  const role = localStorage.getItem('role')

  useEffect(() => {
    async function fetchProtocolo() {
      try {
        if (localStorage.getItem('role') === 'COORDENADOR') {
          const response1 = await axiosInstance.get('/protoon/secretaria');
          setSecretarias(response1.data);
        }
        const response2 = await axiosInstance.get(`/protoon/protocolo/pesquisar-id/${id}`);
        setProtocolo(response2.data);
        setStatusSelecionado(response2.data.status);
      } catch (error) {
        console.error('Erro ao buscar o protocolo:', error);
      }
    }
    fetchProtocolo();
  }, [id]);

  const voltarAnterior = async () => {
    navigate(-1)
  }
  const updateStatusSecretaria = async () => {
    console.log("Deu certo")
    setSuccessMessage("Protocolo redirecionado com sucesso.");
   // Limpa a mensagem de sucesso após alguns segundos
        setTimeout(() => {
          window.location.href = `/protocolos`
        }, 3000); // Define o tempo em milissegundos antes de limpar a mensagem
      }  

  const updateProtocolo = async () => {
    try {
      console.log("Novo status selecionado:", statusSelecionado); // Adicionando console.log para depurar
      console.log(idSecretariaSelecionada)
      
      setSuccessMessage("Protocolo atualizado com sucesso.");
      const response = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/${protocolo.numero_protocolo}`, {
        ...protocolo,
        status: statusSelecionado
      });
      await updateStatusSecretaria()
      setRemoveLoading(false)
          setTimeout(() => {
            console.log(response.data);
            setRemoveLoading(true)
            setMessage('Protocolo atualizado com Sucesso!')
            setType('success')
            setTimeout(() => {
              navigate('/listarProtocolos');
            }, 2000)
          }, 2000)
    } catch (error) {
      console.error('Erro ao atualizar o protocolo:', error);
    }
  }

  const redirectProtocolo = async () => {
    try {
      const response1 = await axiosInstance.get(`/protoon/secretaria/${idSecretariaSelecionada}`)
      console.log(response1.data)
      const secretariaData = response1.data;

      // Exibe um alerta de confirmação antes de redirecionar o protocolo
      const confirmRedirect = window.confirm("Tem certeza que deseja redirecionar o protocolo?");
      if (confirmRedirect) {
        const response2 = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/${protocolo.numero_protocolo}`, {
          ...protocolo,
          secretaria: secretariaData
        });

        // if (response2.status.valueOf() === 200) {
        

        console.log("Entrou no if")
        window.MessageEvent(successMessage)
        // Limpa a mensagem de sucesso após alguns segundos
        window.location.href = `/protocolos`
        // setTimeout(() => {
        //   // setSuccessMessage("");
        // }, 3000); // Define o tempo em milissegundos antes de limpar a mensagem
        // }
      }
    } catch (error) {
      console.error('Erro ao atualizar o protocolo:', error);
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
    setStatusSelecionado(novoStatus); // Atualiza o estado com o novo status selecionado
    setProtocolo(prevProtocolo => ({
      ...prevProtocolo,
      status: novoStatus // Atualiza o status do protocolo com o novo status selecionado
    }));
  };

  if (!protocolo) {
    return <Loading />;
  }

  return (
    <>
      <div style={{ padding: 40, marginTop: -100 }}>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <h1>Detalhes do Protocolo</h1>

        {/* Select para a secretaria */}
        {role === "COORDENADOR" && (
          <div>
            <h3 style={{ marginLeft: -180, marginBottom: -30 }}>Secretaria</h3>
            <select
              style={{ fontSize: 18, marginRight: 10, padding: 10, borderRadius: 10, textAlign: "center" }}
              value={idSecretariaSelecionada} // Aqui se precisa usar idSecretariaSelecionada em vez de selectedSecretaria
              onChange={handleSecretariaChange}
            >
              <option value="">Selecione a secretaria que o funcionário trabalhará</option>
              {secretarias.map(secretaria => (
                <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                  {secretaria.nome_secretaria}
                </option>
              ))}
            </select>
            <button className="btn-log" onClick={redirectProtocolo}>Redirecionar Protocolo</button>
          </div>
        )}
        <fieldset style={{ border: '1px solid #ddd', backgroundColor: '#d0d0d0', padding: 20, borderRadius: 5, marginTop: 50, position: 'relative' }}>
          <legend style={{ fontWeight: 'bold', fontSize: 20, width: '100%', textAlign: 'center', position: 'absolute', top: '-20px', left: '0', backgroundColor: '#d0d0d0', padding: '10px 0' }}>Protocolo</legend>
          <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '100%', padding: 30 }}>
            <thead>
              <div style={{ marginTop: 30 }}></div>
              <tr>
                <th>Assunto</th>
                <th>Número</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center', minWidth: 300 }}>{protocolo.assunto}</td>
                <td>{protocolo.numero_protocolo}</td>
                <td style={{ textAlign: 'center', minWidth: 200 }}>{formatarDataHora(protocolo.data_protocolo)}</td>
                <td style={{ textAlign: 'center', minWidth: 150, maxWidth: 450, wordWrap: 'break-word' }}>
                  <div style={{ maxHeight: '50px', overflowY: 'auto' }}>
                    {protocolo.descricao}
                  </div>
                </td>
                <td>
                  <select
                    value={statusSelecionado}
                    onChange={handleStatusChange}
                  >
                    <option value="EM_ANDAMENTO">EM ANDAMENTO</option>
                    <option value="CIENCIA">CIÊNCIA</option>
                    <option value="CIENCIA_ENTREGA">CIÊNCIA ENTREGA</option>
                    <option value="CONCLUIDO">CONCLUÍDO</option>
                  </select>
                </td>
                <td style={{ textAlign: 'center', minWidth: 100 }}>R$ {protocolo.valor}</td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        {protocolo.secretaria ? (
          <>
            <fieldset style={{ border: '1px solid #ddd', backgroundColor: '#d0d0d0', padding: 20, borderRadius: 5, marginTop: 50, position: 'relative' }}>
              <legend style={{ fontWeight: 'bold', fontSize: 20, width: '100%', textAlign: 'center', position: 'absolute', top: '-20px', left: '0', backgroundColor: '#d0d0d0', padding: '10px 0' }}>Secretaria</legend>
              <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '90%', padding: 30 }}>
                <thead>
                  <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Nome</p></td>
                  <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Responsável</p></td>
                  <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Email</p></td>
                  <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Endereço</p></td>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: 100 }}>{protocolo.secretaria.nome_secretaria}</td>
                    <td style={{ width: 100 }}>{protocolo.secretaria.nome_responsavel}</td>
                    <td style={{ width: 100 }}>{protocolo.secretaria.email}</td>
                    <td style={{ maxWidth: 500 }}>{protocolo.secretaria.endereco.logradouro}, {protocolo.secretaria.endereco.num_endereco}, {protocolo.secretaria.endereco.complemento}, {protocolo.secretaria.endereco.bairro}, {protocolo.secretaria.endereco.cidade} - {protocolo.secretaria.endereco.estado}, {protocolo.secretaria.endereco.pais}</td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </>
        ) : (
          <li>Carregando...</li>
        )}
        <fieldset style={{ border: '1px solid #ddd', backgroundColor: '#d0d0d0', padding: 20, borderRadius: 5, marginTop: 50, position: 'relative' }}>
          <legend style={{ fontWeight: 'bold', fontSize: 20, width: '100%', textAlign: 'center', position: 'absolute', top: '-20px', left: '0', backgroundColor: '#d0d0d0', padding: '10px 0' }}>Municipe</legend>
          <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '90%', padding: 30 }}>
            <thead>
              <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Nome</p></td>
              <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Email</p></td>
              <td style={{ minWidth: 150 }}><p style={{ fontWeight: 700 }}>CPF</p></td>
              <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Data de Nascimento</p></td>
              <td style={{ minWidth: 150 }}><p style={{ fontWeight: 700 }}>Celular</p></td>
              <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Endereço</p></td>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: 100 }}>{protocolo.municipe.nome}</td>
                <td style={{ width: 100 }}>{protocolo.municipe.email}</td>
                <td style={{ width: 100 }}>{protocolo.municipe.num_CPF}</td>
                <td style={{ width: 100 }}>{protocolo.municipe.data_nascimento}</td>
                <td style={{ maxWidth: 50 }}>{protocolo.municipe.celular}</td>
                <td style={{ maxWidth: 500, minWidth: 300 }}>{protocolo.secretaria.endereco.logradouro}, {protocolo.secretaria.endereco.num_endereco}, {protocolo.secretaria.endereco.complemento}, {protocolo.secretaria.endereco.bairro}, {protocolo.secretaria.endereco.cidade} - {protocolo.secretaria.endereco.estado}, {protocolo.secretaria.endereco.pais}</td>
              </tr>
            </tbody>
          </table>
        </fieldset>
        <fieldset style={{ border: '1px solid #ddd', backgroundColor: '#d0d0d0', padding: 20, borderRadius: 5, marginTop: 50, position: 'relative' }}>
          <legend style={{ fontWeight: 'bold', fontSize: 20, width: '100%', textAlign: 'center', position: 'absolute', top: '-20px', left: '0', backgroundColor: '#d0d0d0', padding: '10px 0' }}>Endereço do Protocolo</legend>
          <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '90%', padding: 30 }}>
            <thead>
              <td style={{ minWidth: 100 }}><p style={{ fontWeight: 700 }}>CEP</p></td>
              <td style={{ minWidth: 250 }}><p style={{ fontWeight: 700 }}>Logradouro</p></td>
              <td style={{ minWidth: 100 }}><p style={{ fontWeight: 700 }}>Número</p></td>
              <td style={{ minWidth: 150 }}><p style={{ fontWeight: 700 }}>Complemento</p></td>
              <td style={{ minWidth: 100 }}><p style={{ fontWeight: 700 }}>Bairro</p></td>
              <td style={{ minWidth: 200 }}><p style={{ fontWeight: 700 }}>Cidade</p></td>
              <td style={{ minWidth: 100 }}><p style={{ fontWeight: 700 }}>Estado</p></td>
              <td style={{ minWidth: 100 }}><p style={{ fontWeight: 700 }}>País</p></td>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: 100 }}>{protocolo.endereco.num_cep}</td>
                <td style={{ width: 100 }}>{protocolo.endereco.logradouro}</td>
                <td style={{ width: 100 }}>{protocolo.endereco.num_endereco}</td>
                <td style={{ width: 100 }}>{protocolo.endereco.complemento}</td>
                <td style={{ maxWidth: 50 }}>{protocolo.endereco.bairro}</td>
                <td style={{ maxWidth: 50 }}>{protocolo.endereco.cidade}</td>
                <td style={{ maxWidth: 50 }}>{protocolo.endereco.estado}</td>
                <td style={{ maxWidth: 50 }}>{protocolo.endereco.pais}</td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        {message && <Message type={type} msg={message} />}
        {!removeLoading && <Loading />}
        {removeLoading &&(<><button onClick={updateProtocolo} className="btn-cad" style={{ marginRight: '100px' }}>Salvar Alterações</button>
        <button className="btn-log" onClick={voltarAnterior}>Voltar</button></>)}
      </div >
    </>
  );
}

export default AnalisarProtocolos