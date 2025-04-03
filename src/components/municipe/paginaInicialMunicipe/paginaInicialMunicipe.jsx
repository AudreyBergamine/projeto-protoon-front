import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaTools, FaSearch, FaUser } from "react-icons/fa";
import styles from './paginaInicialMunicipe.module.css';

function PaginaInicialMunicipe() {
  const navigate = useNavigate();
  const sendToReclamar = async () => navigate("/reclamar");
  const sendToSolicitarServico = async () => navigate("/solicitarServico");
  const sendToConsultar = async () => navigate("/consultar");
  const sendToRetornadas = async () => navigate("/retornadas");

  return (
    <div className={styles.container}>
      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        <div className={styles.welcomeSection}>
          <h2 className={styles.welcomeTitle}>Bem-vindo ao Sistema de Protocolos</h2>
          <p className={styles.welcomeText}>Selecione a opção desejada para continuar</p>
        </div>

        <div className={styles.actionCards}>
          {/* Card de Reclamação */}
          <div className={styles.actionCard} onClick={sendToReclamar}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#ff6b6b' }}>
              <FaExclamationTriangle size={24} />
            </div>
            <h3 className={styles.cardTitle}>Abrir Reclamação</h3>
            <p className={styles.cardText}>Registre problemas ou irregularidades encontradas</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Serviço */}
          <div className={styles.actionCard} onClick={sendToSolicitarServico}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#4ecdc4' }}>
              <FaTools size={24} />
            </div>
            <h3 className={styles.cardTitle}>Solicitar Serviço</h3>
            <p className={styles.cardText}>Peça serviços municipais diretamente pelo app</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>

          {/* Card de Consulta */}
          <div className={styles.actionCard} onClick={sendToConsultar}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#45aaf2' }}>
              <FaSearch size={24} />
            </div>
            <h3 className={styles.cardTitle}>Consultar Protocolos</h3>
            <p className={styles.cardText}>Acompanhe o status de suas solicitações</p>
            <button className={styles.cardButton}>Acessar</button>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Prefeitura Municipal - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default PaginaInicialMunicipe;