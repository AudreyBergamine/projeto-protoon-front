
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import URL from '../services/url';

function ListarProtocolosBySecretaria() {
  const axiosInstance = axios.create({
    baseURL: URL, // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });

  // const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");
  const [protocolos, setProtocolos] = useState([]);
  const [pesquisarProt, setPesquisarProt] = useState(''); //Pesquisar protocolos
  const navigate = useNavigate(); // Use o hook useNavigation para acessar a navegação
  // Recuperar o token do localStorage
  const token = localStorage.getItem('token');

  const [ocultarConcluidos, setOcultarConcluidos] = useState(false);
  const [prazoConclusaoSimulado, setPrazoConclusaoSimulado] = useState({}); // Valor inicial em minutos

  // Adicionar o token ao cabeçalho de autorização
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;


  useEffect(() => {
    async function fetchProtocolos() {

      try {
        const response1 = await axiosInstance.get(`/protoon/funcionarios/bytoken`);
        const id_secretaria = response1.data.secretaria.id_secretaria;

        const response2 = await axiosInstance.get(`/protoon/secretaria/protocolos/` + id_secretaria);
        setProtocolos(response2.data);

        const novosPrazoConclusao = {};

        response2.data.forEach(protocolo => {
          if (protocolo.status === "CONCLUIDO" || protocolo.status === "CANCELADO") {
            novosPrazoConclusao[protocolo.id_protocolo] = null; // Se estiver concluído, define como null
          } else if (protocolo.status === "PAGAMENTO_PENDENTE") {
            // Verifica se passaram 4 dias
            const dataProtocolo = new Date(protocolo.data_protocolo); // Converter string para Date

            const diferencaDias = (Date.now() - dataProtocolo.getTime()) / (1000 * 60 * 60 * 24);

            if (diferencaDias >= 4) {
              // Faz o update do status para "CANCELADO"
              const response = axiosInstance.put(`/protoon/protocolo/alterar-protocolos/status/${protocolo.numero_protocolo}`, {
                ...protocolo,
                status: "CANCELADO"
              });
              let isRequesting = false;

              if (!isRequesting) {
                isRequesting = true;
                try {
                  const response1 = axiosInstance.post(
                    `/protoon/devolutiva/criar-devolutiva-boleto`,
                    protocolo
                  );
                  console.log("Devolutiva enviada com sucesso!");
                } catch (error) {
                  console.error("Erro ao enviar a devolutiva", error);
                } finally {
                  isRequesting = false;
                }
              }
              novosPrazoConclusao[protocolo.id_protocolo] = null;
            }
          } else {
            // Converte data_protocolo para um objeto Date
            const dataProtocolo = new Date(protocolo.data_protocolo);

            // Converte prazoConclusao de dias para milissegundos
            const prazoEmMilissegundos = protocolo.prazoConclusao * 24 * 60 * 60 * 1000;

            // Calcula a data final somando prazoConclusao
            const dataFinal = new Date(dataProtocolo.getTime() + prazoEmMilissegundos);

            // Calcula o tempo restante em segundos
            const tempoRestante = Math.max(Math.floor((dataFinal - Date.now()) / 1000), 0);

            // Armazena o tempo restante
            novosPrazoConclusao[protocolo.id_protocolo] = tempoRestante;
          }
        });
        setPrazoConclusaoSimulado(novosPrazoConclusao);

      } catch (error) {
        console.error('Erro ao buscar as secretarias:', error);
      }
    }
    fetchProtocolos();

    // Simulação de contagem regressiva para o prazo
    const intervalId = setInterval(() => {
      setPrazoConclusaoSimulado((prev) => {
        const novosPrazoConclusao = { ...prev };
        let todosFinalizados = true;

        Object.keys(novosPrazoConclusao).forEach(id => {
          novosPrazoConclusao[id] -= 1; // Atualiza o tempo a cada segundo (1000 ms), aumente se quiser acelerar a Simulação
          todosFinalizados = false; // Continuar se não estiver finalizado
        });

        if (todosFinalizados) {
          clearInterval(intervalId); // Para o contador se todos os prazos tiverem vencido
        }

        return novosPrazoConclusao;
      });
    }, 1000); // Atualiza a cada segundo

    return () => clearInterval(intervalId);
  }, []);

  // Função para determinar a cor baseada no prazo
  const prazoCor = (prazoEmSegundos) => {
    const timeLeft = prazoEmSegundos;
    if (timeLeft < 4 * 24 * 60 * 60) { // Menor ou igual a 4 dias
      return { backgroundColor: 'red', color: 'white' };
    }
    if (timeLeft < 7 * 24 * 60 * 60) { // Menor ou igual a 7 dias
      return { backgroundColor: 'yellow', color: 'black' };
    }
    return {}; // Cor normal
  };

  const handleClick = (id) => {
    // Redirecionar para outra página com o ID do protocolo na URL usando navigater
    navigate(`/protocolo/${id}`);
  };
  const voltarIndex = async () => {
    navigate("/")
  }

  //Função para formatar a data e a hora com base no Brasil/sp
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

  // Função para filtrar e ordenar os protocolos por prazo
  const filteredProtocolos = protocolos
    .filter(protocolo => protocolo.numero_protocolo.toLowerCase().includes(pesquisarProt.toLowerCase()))
    .filter(protocolo => ocultarConcluidos || protocolo.status !== "CONCLUIDO")
    .sort((a, b) => {
      const prazoA = a.prazoConclusao;  // Se o valor for uma data
      const prazoB = b.prazoConclusao;

      // Ordena pelo prazo (menor prazo primeiro)
      return prazoA - prazoB;
    });

  const handleOcultarConcluidosChange = () => {
    setOcultarConcluidos(!ocultarConcluidos);
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        <h1>Lista de Protocolos</h1>
        <input
          type="text"
          placeholder="Pesquisar por número de protocolo..."
          value={pesquisarProt}
          onChange={(e) => setPesquisarProt(e.target.value)}
        />
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <label style={{ fontSize: '20px' }}>
            <input
              type="checkbox"
              checked={ocultarConcluidos}
              onChange={handleOcultarConcluidosChange}
              style={{ marginRight: -140, transform: 'scale(2)' }}
            />
            Mostrar Protocolos Concluídos
          </label>
        </div>
        <table style={{ margin: 'auto', borderCollapse: 'collapse', width: '100%', padding: 30 }}>
          <thead>
            <tr>
              <th>Assunto</th>
              <th>Número</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Valor</th>
              <th>Prazo de Coclusão</th>
              {/* <th>Simulação em Segundos</th> */}
            </tr>
          </thead>
          <div style={{ marginTop: 30 }}></div>
          <tbody>
            {filteredProtocolos
              .filter(protocolo => ocultarConcluidos || protocolo.status !== "CONCLUIDO")
              .map((protocolo, index) => {
                const prazoEmSegundos = prazoConclusaoSimulado[protocolo.id_protocolo] || 0; // Converte o prazo em dias para segundos
                const prazo = protocolo.prazoConclusao; // Usa o prazo real ou o simulado
                const prazoStyle = protocolo.status === 'CONCLUIDO' || protocolo.status === 'CANCELADO' ? {} : prazoCor(prazoEmSegundos);
                return (
                  <React.Fragment key={protocolo.id_protocolo}>
                    <tr onClick={() => handleClick(protocolo.id_protocolo)} className="rowTable" style={prazoStyle}>
                      <td style={{ textAlign: 'center', minWidth: 300 }}>{protocolo.assunto}</td>
                      <td style={{ textAlign: 'center', minWidth: 80 }}>{protocolo.numero_protocolo}</td>
                      <td style={{ textAlign: 'center', minWidth: 200 }}>{formatarDataHora(protocolo.data_protocolo)}</td>
                      <td style={{ textAlign: 'center', minWidth: 250, maxWidth: 450, wordWrap: 'break-word' }}>
                        <div style={{ maxHeight: '50px', overflowY: 'auto' }}>
                          {protocolo.descricao}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', minWidth: 200 }}>{protocolo.status}</td>
                      <td style={{ textAlign: 'center', minWidth: 100 }}>{'R$ ' + protocolo.valor.toFixed(2)}</td>
                      {protocolo.status !== 'CONCLUIDO' && protocolo.status !== 'CANCELADO' && (
                        <>
                          <td style={{ textAlign: 'center', minWidth: 100 }}>{prazo} dia(s)</td>
                          {/* <td style={{ textAlign: 'center', minWidth: 100 }}>
                            {prazoEmSegundos === null ? "Concluído" : prazoEmSegundos}
                            </td> */}
                        </>
                      )}
                    </tr>
                    {index !== filteredProtocolos.length - 1 && <tr><td colSpan="6"><hr style={{ margin: 0 }} /></td></tr>}
                  </React.Fragment>
                );
              })}

          </tbody>
        </table>
        <button className="btn-log" onClick={voltarIndex}>Voltar</button>
      </div >
    </>
  );
}

export default ListarProtocolosBySecretaria