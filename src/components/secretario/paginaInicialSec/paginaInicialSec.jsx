import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaRegEdit } from "react-icons/fa"; // Ícones para as ações
import styles from './paginaInicialSec.module.css'; // Importando o módulo CSS

function PaginaInicialSecretario() {
  const navigate = useNavigate();

  const handleCadastrarClick = () => {
    navigate("/cadastrar-funcionarios");
  };

  const sendToFuncionarios = () => {
    navigate("/funcionarios"); // Redireciona para a lista de funcionários
  };

  return (
    <div className={styles.container}>
      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>Bem-vindo ao Sistema de Gestão de Funcionários</h2>
          <p className={styles.welcomeText}>Selecione a opção desejada para continuar</p>
        </div>

        <div className={styles.actionCards}>
          {/* Card de Cadastrar Funcionários */}
          <div className={styles.actionCard} onClick={handleCadastrarClick}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#ff6b6b' }}>
              <FaUserPlus size={24} />
            </div>
            <h3 className={styles.cardTitle}>Cadastrar Funcionários</h3>
            <p className={styles.cardText}>Cadastre novos funcionários no sistema</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Alterar Dados de Funcionários */}
          <div className={styles.actionCard} onClick={sendToFuncionarios}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#4ecdc4' }}>
              <FaRegEdit size={24} />
            </div>
            <h3 className={styles.cardTitle}>Alterar Dados de Funcionários</h3>
            <p className={styles.cardText}>Altere ou atualize os dados de funcionários cadastrados</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaInicialSecretario;
