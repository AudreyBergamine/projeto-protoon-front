import React from "react";
import { useNavigate } from "react-router-dom";

function PaginaInicialCoordenador() {

  const navigate = useNavigate();

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
          alignItems: "center",
          margin: "auto",
          justifyContent: "space-around",
          height: "40vh",
          padding: 100,
        }}
      >
         <button className="btn-log" onClick={() => (navigate('/gerenciar-secretaria'))}>
          Cadastrar Secretarias
        </button>
        <button className="btn-log" onClick={() => (navigate('/protocolos'))}>
          Listar Protocolos
        </button>
        
      </div>
    </>
  );
}

export default PaginaInicialCoordenador;
