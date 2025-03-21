import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa"; // Ícone de alerta
import axios from "axios";
import URL from '../../services/url';
import styles from './paginaInicialCoord.module.css';

function PaginaInicialCoordenador() {

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

        const dataAtual = new Date();

        // Cria a data limite, que é a data atual + 7 dias
        const dataLimite = new Date(dataAtual);
        dataLimite.setDate(dataAtual.getDate() + 7);

        // Verifica se há protocolos com prazo menor que 7 dias e não concluídos
        const alerta = protocolosAtualizados.some(
          (protocolo) =>
            protocolo.prazoConclusao !== null &&
            new Date(protocolo.prazoConclusao) < dataLimite
        );

        setTemAlerta(alerta);

      } catch (error) {
        console.error("Erro ao buscar os protocolos:", error);
      }
    }

    fetchProtocolos();
  }, []);

  return (
    <>
      <div className={styles.paginaInicialContainer}>
        {temAlerta && (
          <div
            className={styles`alerta ${protocolos.some(protocolo => {
              const prazoConclusaoDate = protocolo.prazoConclusao ? new Date(protocolo.prazoConclusao) : null;
              const dataAtual = new Date();
              const diffTime = prazoConclusaoDate ? prazoConclusaoDate - dataAtual : 0;
              const diffDays = prazoConclusaoDate ? Math.ceil(diffTime / (1000 * 3600 * 24)) : Infinity;

              return (
                prazoConclusaoDate !== null &&
                diffDays <= 7 // Se o prazo estiver dentro de 7 dias
              );
            }) ? "show" : ""}`}
            onClick={() => navigate("/protocolos")}
          >
            <FaExclamationTriangle title="Há protocolos com prazo próximo do vencimento!" />
          </div>
        )}
        <div className="button-container">
          <button className="btn-log" onClick={() => navigate('/protocolos')}>
            Listar Protocolos
          </button>
          <button className="btn-log" onClick={() => navigate('/cadastrar-assunto')}>
            Cadastro de Assunto
          </button>
          <button className="btn-log" onClick={() => navigate('/redirecionamentos-coordenador')}>
            Aprovar Redirecionamentos
          </button>
          <button className="btn-log" onClick={() => navigate('/relatorios')}>
            Relatórios
          </button>
          <button className="btn-log" onClick={() => navigate('/gerenciar-secretaria')}>
            Cadastrar Secretarias
          </button>
          <button className="btn-log" onClick={() => navigate('/logs')}>
            Logs
          </button>
        </div>
      </div>
    </>
  );
}

export default PaginaInicialCoordenador;
