import React from "react";
import { Navigate } from "react-router-dom";

function PaginaInicialSecretario() {
  const handleCadastrarClick = () => {
    return <Navigate to="/cadastro-funcionarios" />;
  };

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
        }}
      >
        <button className="btn-log" onClick={handleCadastrarClick}>
          Cadastrar Funcionários
        </button>
      </div>
    </>
  );
}

export default PaginaInicialSecretario;
