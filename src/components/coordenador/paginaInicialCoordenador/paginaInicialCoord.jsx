import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaTools, FaSearch, FaUser } from "react-icons/fa";
import axios from "axios";
import URL from '../../services/url';
import styles from './paginaInicialCoord.module.css'; // Importando o módulo CSS

function PaginaInicialCoordenador() {
  const navigate = useNavigate();
  const [protocolos, setProtocolos] = useState([]);
  const [alertaStatus, setAlertaStatus] = useState("transparente"); // Estado do alerta

  const axiosInstance = axios.create({
    baseURL: URL, // Ajuste a URL base conforme necessário
    withCredentials: true,
  });

  const token = localStorage.getItem("token");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    async function fetchProtocolos() {
      try {
        const response1 = await axiosInstance.get(`/protoon/funcionarios/bytoken`);
        const id_secretaria = response1.data.secretaria.id_secretaria;

        const response2 = await axiosInstance.get(`/protoon/secretaria/protocolos/` + id_secretaria);

        const protocolosAtualizados = response2.data.map(protocolo => {
          if (protocolo.data_protocolo && protocolo.prazoConclusao !== null) {
            const dataProtocolo = new Date(protocolo.data_protocolo); // Converter para Date
            const prazoEmMilissegundos = protocolo.prazoConclusao * 24 * 60 * 60 * 1000; // Converter dias para ms
            const dataLimite = new Date(protocolo.prazoConclusao);   // Data final do prazo

            const agora = new Date();
            const prazoRestante = Math.ceil((dataLimite - agora) / (1000 * 60 * 60 * 24)); // Converter ms para dias

            return { ...protocolo, prazoRestante };
          }
          return { ...protocolo, prazoRestante: null };
        });

        setProtocolos(protocolosAtualizados);

        // Verifica o status dos protocolos
        const agora = new Date();
        const temVencido = protocolosAtualizados.some(
          (protocolo) =>
            protocolo.prazoConclusao !== null &&
            new Date(protocolo.prazoConclusao) < agora
        );

        const temProximo = protocolosAtualizados.some(
          (protocolo) =>
            protocolo.prazoConclusao !== null &&
            new Date(protocolo.prazoConclusao) >= agora &&
            new Date(protocolo.prazoConclusao) <= new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 dias
        );

        // Verifica se o prazo restante é menor que 3 dias e exibe o alerta vermelho
        const prazoMenorQue3Dias = protocolosAtualizados.some(
          (protocolo) => protocolo.prazoRestante < 4
        );

        if (prazoMenorQue3Dias) {
          setAlertaStatus("vermelho"); // Alerta vermelho para protocolos com prazo menor que 3 dias
        } else if (temVencido) {
          setAlertaStatus("vermelho"); // Alerta vermelho se houver protocolos vencidos
        } else if (temProximo) {
          setAlertaStatus("amarelo"); // Alerta amarelo se houver protocolos próximos do vencimento
        } else {
          setAlertaStatus("transparente"); // Transparente se não houver alertas
        }
      } catch (error) {
        console.error("Erro ao buscar os protocolos:", error);
      }
    }

    fetchProtocolos();
  }, []);

  const sendToProtocolos = () => navigate("/protocolos");
  const sendToCadastrarAssunto = () => navigate("/cadastrar-assunto");
  const sendToRedirecionamentos = () => navigate("/redirecionamentos-coordenador");
  const sendToRelatorios = () => navigate("/relatorios");
  const sendToCadastrarSecretarias = () => navigate("/gerenciar-secretaria");
  const sendToAnalisarComprovantes = () => navigate("/analisar-comprovantes");

  const sendToLogs = () => navigate("/logs");

  return (
    <div className={styles.container}>
      {/* Alerta de prazo */}
      <div
        className={`${styles.alerta} ${alertaStatus === "amarelo" ? styles.alertaAmarelo :
          alertaStatus === "vermelho" ? styles.alertaVermelho : ""
          }`}
        onClick={sendToProtocolos}
      >
        <FaExclamationTriangle title="Há protocolos com prazo próximo do vencimento!" />
      </div>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>Bem-vindo ao Sistema de Protocolos</h2>
          <p className={styles.welcomeText}>Selecione a opção desejada para continuar</p>
        </div>

        <div className={styles.actionCards}>
          {/* Card de Listar Protocolos */}
          <div className={styles.actionCard} onClick={sendToProtocolos}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#ff6b6b' }}>
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className={styles.cardTitle}>Listar Protocolos</h3>
            <p className={styles.cardText}>Veja todos os protocolos registrados</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Cadastro de Assunto */}
          <div className={styles.actionCard} onClick={sendToCadastrarAssunto}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#4ecdc4' }}>
              <FaTools size={24} />
            </div>
            <h3 className={styles.cardTitle}>Cadastro de Assunto</h3>
            <p className={styles.cardText}>Cadastre novos assuntos para protocolos</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Aprovar Redirecionamentos */}
          <div className={styles.actionCard} onClick={sendToRedirecionamentos}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#45aaf2' }}>
              <FaSearch size={24} />
            </div>
            <h3 className={styles.cardTitle}>Aprovar Redirecionamentos</h3>
            <p className={styles.cardText}>Aprove ou rejeite redirecionamentos</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Relatórios */}
          <div className={styles.actionCard} onClick={sendToRelatorios}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#ffbb33' }}>
              <FaUser size={24} />
            </div>
            <h3 className={styles.cardTitle}>Relatórios</h3>
            <p className={styles.cardText}>Consulte relatórios gerenciais</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Gerenciar Secretarias */}
          <div className={styles.actionCard} onClick={sendToCadastrarSecretarias}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#34b7f1' }}>
              <FaTools size={24} />
            </div>
            <h3 className={styles.cardTitle}>Cadastrar Secretarias</h3>
            <p className={styles.cardText}>Cadastre novas secretarias no sistema</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          <div className={styles.actionCard} onClick={sendToAnalisarComprovantes}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#34b7f1' }}>
              <FaTools size={24} />
            </div>
            <h3 className={styles.cardTitle}>Analisar Comprovantes</h3>
            <p className={styles.cardText}>Análise os comprovantes de pagamento</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Logs */}
          <div className={styles.actionCard} onClick={sendToLogs}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#2ecc71' }}>
              <FaUser size={24} />
            </div>
            <h3 className={styles.cardTitle}>Logs</h3>
            <p className={styles.cardText}>Consulte os logs de atividades</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaInicialCoordenador;
