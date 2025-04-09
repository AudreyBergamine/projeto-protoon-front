import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import URL from '../../services/url';
import styles from './paginaInicialFuncionario.module.css';

function PaginaInicialFuncionario() {
  const navigate = useNavigate();
  const [protocolos, setProtocolos] = useState([]);
  const [temAlerta, setTemAlerta] = useState(false);

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
        setProtocolos(response2.data);

        // Verifica se há protocolos com prazo menor que 7 dias
        const alerta = response2.data.some(
          (protocolo) => protocolo.prazoConclusao !== null &&
            protocolo.prazoConclusao < 7 &&
            protocolo.status !== "CONCLUIDO"
        );
        setTemAlerta(alerta);
      } catch (error) {
        console.error("Erro ao buscar os protocolos:", error);
      }
    }

    fetchProtocolos();
  }, []);

  return (
    <div className={styles.container}>
      {/* Alerta de prazo */}
      {temAlerta && (
        <div
          className={styles.alerta}
          style={{
            color: protocolos.some(
              (protocolo) =>
                protocolo.prazoConclusao !== null &&
                protocolo.prazoConclusao < 7 &&
                protocolo.status !== "CONCLUIDO"
            )
              ? protocolos.some(
                (protocolo) =>
                  protocolo.prazoConclusao < 4 && protocolo.status !== "CONCLUIDO"
              )
                ? "red"
                : "yellow"
              : "transparent",
          }}
          onClick={() => navigate("/protocolos")}
        >
          <FaExclamationTriangle title="Há protocolos com prazo próximo do vencimento!" />
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>Bem-vindo ao Sistema de Protocolos</h2>
          <p className={styles.welcomeText}>Selecione a opção desejada para continuar</p>
        </div>

        <div className={styles.actionCards}>
          {/* Card de Listar Protocolos */}
          <div className={styles.actionCard} onClick={() => navigate("/protocolos")}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#ff6b6b' }}>
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className={styles.cardTitle}>Listar Protocolos</h3>
            <p className={styles.cardText}>Veja todos os protocolos registrados</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Status Redirecionamentos */}
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
