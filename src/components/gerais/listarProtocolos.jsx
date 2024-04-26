
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function ListarProtocolosBySecretaria(){
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080', // Adjust the base URL as needed
        withCredentials: true, // Set withCredentials to true
      });

     // const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");
      const [protocolos, setProtocolos] = useState([]);
      const [pesquisarProt, setPesquisarProt] = useState(''); //Pesquisar protocolos
      const navigate = useNavigate(); // Use o hook useNavigation para acessar a navegação

      useEffect(() => {
        async function fetchProtocolos() {
          
          try {
            const response1 = await axiosInstance.get('/protoon/funcionarios/bytoken');
            console.log(response1.data)
            console.log(response1.data.secretaria)
            const id_secretaria = response1.data.secretaria.id_secretaria;

            const response2 = await axiosInstance.get(`/protoon/secretaria/protocolos/${id_secretaria}`);
            setProtocolos(response2.data);
          } catch (error) {
            console.error('Erro ao buscar as secretarias:', error);
          }
        }
        fetchProtocolos();
      }, []);

      const handleClick = (id) => {
        // Redirecionar para outra página com o ID do protocolo na URL usando navigate
        navigate(`/protocolo/${id}`);
      };

      //Função para formatar a data e a hora com base no Brasil/sp
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

      // Função para filtrar os protocolos com base no número
const filteredProtocolos = protocolos.filter((protocolo) => {
  return protocolo.numero_protocolo.toLowerCase().includes(pesquisarProt.toLowerCase());
});



    
      return (
        <div>
          <h1>Lista de Protocolos</h1>
          <input
        type="text"
        placeholder="Pesquisar por número de protocolo..."
        value={pesquisarProt}
        onChange={(e) => setPesquisarProt(e.target.value)}
      />
          <table>
            <thead>
            
              <tr>
                <th>ID</th>
                <th>Assunto</th>
                <th>Número</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredProtocolos.map((protocolo) => (
                <tr key={protocolo.id_protocolo} onClick={() => handleClick(protocolo.id_protocolo)}>
                  <td>{protocolo.id_protocolo}</td>
                  <td>{protocolo.assunto}</td>
                  <td>{protocolo.numero_protocolo}</td>
                  <td>{formatarDataHora(protocolo.data_protocolo)}</td>
                  <td>{protocolo.descricao}</td>
                  <td>{protocolo.status}</td>
                  <td>{protocolo.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

export default ListarProtocolosBySecretaria