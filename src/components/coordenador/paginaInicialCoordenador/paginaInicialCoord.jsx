import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa"; // Ícone de alerta
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
            const dataLimite = new Date(dataProtocolo.getTime() + prazoEmMilissegundos); // Data final do prazo

            const agora = new Date();
            const prazoRestante = Math.ceil((dataLimite - agora) / (1000 * 60 * 60 * 24)); // Converter ms para dias

            return { ...protocolo, prazoRestante };
          }
          return protocolo;
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

        if (temVencido) {
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

  return (
    <>
      <div className={styles.paginaInicialContainer}>
        <div
          className={`${styles.alerta} ${alertaStatus === "amarelo" ? styles.alertaAmarelo :
              alertaStatus === "vermelho" ? styles.alertaVermelho :
                ""
            }`}
          onClick={() => navigate("/protocolos")}
        >
          <FaExclamationTriangle title="Há protocolos com prazo próximo do vencimento!" />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.btnLog} onClick={() => navigate('/protocolos')}>
            Listar Protocolos
          </button>
          <button className={styles.btnLog} onClick={() => navigate('/cadastrar-assunto')}>
            Cadastro de Assunto
          </button>
          <button className={styles.btnLog} onClick={() => navigate('/redirecionamentos-coordenador')}>
            Aprovar Redirecionamentos
          </button>
          <button className={styles.btnLog} onClick={() => navigate('/relatorios')}>
            Relatórios
          </button>
          <button className={styles.btnLog} onClick={() => navigate('/gerenciar-secretaria')}>
            Cadastrar Secretarias
          </button>
          <button className={styles.btnLog} onClick={() => navigate('/logs')}>
            Logs
          </button>
        </div>
      </div>
    </>
  );
}

export default PaginaInicialCoordenador;