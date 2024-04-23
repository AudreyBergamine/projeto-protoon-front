import { Navigate } from "react-router-dom";
const navigate = Navigate();
const handleCadastrarClick = () => {
    navigate('/cadastrar/funcionarios'); // Navegar para a rota '/cadastrar/funcionarios' ao clicar no botão
  }

function PaginaInicialSecretario() {

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', width: 200, alignItems: 'center', margin: 'auto', justifyContent: 'space-between', height: '40vh', padding: 100 }}>
          <button className="btn-log" onClick={handleCadastrarClick}>Cadastrar Funcionários</button>
        </div>
      </>
    );
  }

export default PaginaInicialSecretario;