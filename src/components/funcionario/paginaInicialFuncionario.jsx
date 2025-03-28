import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa"; // Ícone de alerta
import axios from "axios";
import URL from '../services/url';

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
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
          alignItems: "center",
          margin: "auto",
          justifyContent: "space-between",
          height: "40vh",
          padding: 100,
          position: "relative",
        }}
      >
        {temAlerta && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: 'pointer',
              fontSize: 30,
              color: protocolos.some(protocolo =>
                protocolo.prazoConclusao !== null &&
                protocolo.prazoConclusao < 7 &&
                protocolo.status !== "CONCLUIDO"
              )
                ? (protocolos.some(protocolo => protocolo.prazoConclusao < 4 && protocolo.status !== "CONCLUIDO")
                  ? "red" // Vermelho se for menor que 4 dias
                  : "yellow") // Amarelo se for menor que 7 dias
                : "transparent" // Oculto caso não haja alertas
            }}
            onClick={() => navigate("/protocolos")}
          >
            <FaExclamationTriangle title="Há protocolos com prazo próximo do vencimento!" />
          </div>
        )}

        <button className="btn-log" onClick={() => navigate("/protocolos")}>
          Listar Protocolos
        </button>
        <button className="btn-log" onClick={() => navigate("/redirecionamentos-funcionario")}>
          Status Redirecionamentos
        </button>
      </div>
    </>
  );
}

export default PaginaInicialFuncionario;
