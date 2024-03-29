import React, { useEffect, useState } from 'react';
// import { useToken } from '../../context/TokenContext';
import { useNavigate, Link } from "react-router-dom";

function Teste() {
  const navigate = useNavigate();
  const { tempoRestante, clearTempoRestante } = useState(null);

  useEffect(() => {
    console.log('Tempo restante ao entrar:', tempoRestante);

    return () => {
      console.log('Tempo restante ao sair:', tempoRestante);
      
    };
  }, []);

  if (!tempoRestante) {
    // Tempo expirado, redirecione para a página de login
    navigate('/authenticate');
  }

  return (
    <div>
      <h1>Tempo restante do token: {tempoRestante}</h1>
      <Link to="/authenticate">Sair</Link>
    </div>
  );
}

export default Teste;
