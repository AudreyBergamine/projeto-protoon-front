import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaTools } from "react-icons/fa";
import axios from "axios";
import URL from '../../services/url';
import styles from './paginaInicialFuncionario.module.css';
import { verificarStatusAlerta } from "../../utils/verificaAlertas";

function PaginaInicialFuncionario() {
  const navigate = useNavigate();
  const [protocolos, setProtocolos] = useState([]);
  const [alertaStatus, setAlertaStatus] = useState("transparente");

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  const sendToAnalisarComprovantes = () => navigate("/analisar-comprovantes");

  useEffect(() => {
    async function fetchProtocolos() {
      try {
        const response1 = await axiosInstance.get(`/protoon/funcionarios/bytoken`);
        const id_secretaria = response1.data.secretaria.id_secretaria;
        const response2 = await axiosInstance.get(`/protoon/secretaria/protocolos/` + id_secretaria);
        const protocolosRecebidos = response2.data;
        setProtocolos(protocolosRecebidos); // atualiza o estado

        const status = verificarStatusAlerta(protocolosRecebidos); // usa diretamente os dados recebidos
        setAlertaStatus(status);
      } catch (error) {
        console.error("Erro ao buscar os protocolos:", error);
      }
    }

    fetchProtocolos();
  }, []);

  return (
    <div className={styles.container}>
      {alertaStatus !== "transparente" && (
        <div
          className={`${styles.alerta} ${alertaStatus === "vermelho" ? styles.alertaVermelho :
            alertaStatus === "amarelo" ? styles.alertaAmarelo : ""}`}
          onClick={() => navigate("/protocolos")}
        >
          <FaExclamationTriangle title="Há protocolos com prazo próximo do vencimento!" />
        </div>
      )}

      <main className={styles.mainContent}>
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>Bem-vindo ao PROTO-ON - Sistema de Protocolos</h2>
          <p className={styles.welcomeText}>Selecione a opção desejada para continuar</p>
        </div>

        <div className={styles.actionCards}>
          <div className={styles.actionCard} onClick={() => navigate("/protocolos")}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#ff6b6b' }}>
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className={styles.cardTitle}>Listar Protocolos</h3>
            <p className={styles.cardText}>Veja todos os protocolos registrados</p>
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

          <div className={styles.actionCard} onClick={() => navigate("/redirecionamentos-funcionario")}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#4ecdc4' }}>
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className={styles.cardTitle}>Status Redirecionamentos</h3>
            <p className={styles.cardText}>Verifique o status dos redirecionamentos</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaInicialFuncionario;
