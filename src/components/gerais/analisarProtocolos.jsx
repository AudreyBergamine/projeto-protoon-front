
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function AnalisarProtocolos() {
  const navigate = useNavigate()
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
  });
  const [protocolo, setProtocolo] = useState(null);
  const [statusSelecionado, setStatusSelecionado] = useState(""); // Estado para armazenar o status selecionado
  const [secretarias, setSecretarias] = useState([]);
  const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para armazenar a mensagem de sucesso
  const { id } = useParams();
  const role = localStorage.getItem('role')

  useEffect(() => {
    async function fetchProtocolo() {
      try {
        if(localStorage.getItem('role') ==='COORDENADOR'){
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

  

  const updateProtocolo = async () =>{
    try {
      console.log("Novo status selecionado:", statusSelecionado); // Adicionando console.log para depurar
    
      const response = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/${protocolo.id_protocolo}`,{
        ...protocolo,
        status: statusSelecionado
      });
  
      if(response.status.valueOf() == 200){
        setSuccessMessage("Protocolo atualizado com sucesso.");

        // Limpa a mensagem de sucesso após alguns segundos
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000); // Define o tempo em milissegundos antes de limpar a mensagem
      }
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
        const response2 = await axiosInstance.put(`/protoon/protocolo/alterar-protocolos/${protocolo.id_protocolo}`, {
          ...protocolo,
          secretaria: secretariaData
        });
  
        if (response2.status.valueOf() == 200) {
          setSuccessMessage("Protocolo redirecionado com sucesso.");
  
          // Limpa a mensagem de sucesso após alguns segundos
          setTimeout(() => {
            setSuccessMessage("");
            window.location.href = `/protocolos`
          }, 3000); // Define o tempo em milissegundos antes de limpar a mensagem
        }
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
      second: "2-digit",
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
    return <div>Carregando...</div>;
  }

  return (
    <div>
    {successMessage && <div className="success-message">{successMessage}</div>}
      <h1>Detalhes do Protocolo</h1>

       {/* Select para a secretaria */}
       {role === "COORDENADOR" && (
<div>
  <label>Secretaria:</label><br />
  <select
    style={{ fontSize: 20, padding: 10, borderRadius: 10, textAlign: "center" }}
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

      <table>
        <tbody>
          <tr>
            <td>ID do Protocolo</td>
            <td>{protocolo.id_protocolo}</td>
          </tr>
          <tr>
            <td>Assunto</td>
            <td>{protocolo.assunto}</td>
          </tr>
          <tr>
            <td>Número do Protocolo</td>
            <td>{protocolo.numero_protocolo}</td>
          </tr>
          <tr>
            <td>Data do Protocolo</td>
            <td>{formatarDataHora(protocolo.data_protocolo)}</td>
          </tr>
          <tr>
            <td>Descrição</td>
            <td>{protocolo.descricao}</td>
          </tr>
          <tr>
            <td>Status</td>
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
          </tr>
          <tr>
            <td>Valor</td>
            <td>{protocolo.valor}</td>
          </tr>
          <tr>
            <td>Secretaria</td>
            <td>
              <ul>
              {protocolo.secretaria ? (
      <>
        <li>ID: {protocolo.secretaria.id_secretaria}</li>
        <li>Nome: {protocolo.secretaria.nome_secretaria}</li>
        <li>Responsável: {protocolo.secretaria.nome_responsavel}</li>
        <li>Email: {protocolo.secretaria.email}</li>
        <li>Endereço: {protocolo.secretaria.endereco.logradouro}, {protocolo.secretaria.endereco.num_endereco}, {protocolo.secretaria.endereco.complemento}, {protocolo.secretaria.endereco.bairro}, {protocolo.secretaria.endereco.cidade} - {protocolo.secretaria.endereco.estado}, {protocolo.secretaria.endereco.pais}</li>
      </>
    ) : (
      <li>Carregando...</li>
    )}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Munícipe</td>
            <td>
              <ul>
              {protocolo.municipe ? (
        <>
          <li>ID: {protocolo.municipe.id}</li>
          <li>Nome: {protocolo.municipe.nome}</li>
          <li>Email: {protocolo.municipe.email}</li>
          <li>CPF: {protocolo.municipe.num_CPF}</li>
          <li>Celular: {protocolo.municipe.celular}</li>
          <li>Data de Nascimento: {protocolo.municipe.data_nascimento}</li>
          {protocolo.municipe.endereco && (
            <li>
              Endereço: {protocolo.municipe.endereco.logradouro}, {protocolo.municipe.endereco.num_endereco}, {protocolo.municipe.endereco.complemento}, {protocolo.municipe.endereco.bairro}, {protocolo.municipe.endereco.cidade} - {protocolo.municipe.endereco.estado}, {protocolo.municipe.endereco.pais}
            </li>
          )}
        </>
      ) : (
        <li>Carregando...</li>
      )}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Endereço do Protocolo</td>
            <td>
              <ul>
                  {protocolo.endereco ? (
        <>
          <li>ID: {protocolo.endereco.id_endereco}</li>
          <li>Tipo: {protocolo.endereco.tipo_endereco}</li>
          <li>CEP: {protocolo.endereco.num_cep}</li>
          <li>Logradouro: {protocolo.endereco.logradouro}</li>
          <li>Número: {protocolo.endereco.num_endereco}</li>
          <li>Complemento: {protocolo.endereco.complemento}</li>
          <li>Bairro: {protocolo.endereco.bairro}</li>
          <li>Cidade: {protocolo.endereco.cidade}</li>
          <li>Estado: {protocolo.endereco.estado}</li>
          <li>País: {protocolo.endereco.pais}</li>
        </>
      ) : (
        <li>Carregando...</li>
      )}
              </ul>
            </td>
          </tr>
         
        </tbody>

        
      </table>
      <button className="btn-log" onClick={updateProtocolo}>Salvar Alterações</button>
      <br></br><br></br><br></br><br></br>

    </div>
  );
}
export default AnalisarProtocolos