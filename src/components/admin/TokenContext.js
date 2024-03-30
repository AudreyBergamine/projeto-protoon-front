import React, { createContext, useState, useContext } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tempoRestante, setTempoRestante] = useState(null);

  return (
    <TokenContext.Provider value={{ tempoRestante, setTempoRestante }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('Token deve ser usado dentro de um Fornecedor de Token');
  }
  return context;
};
