import React, { createContext, useState, useContext, useEffect } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tempoRestante, setTempoRestante] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTempoRestante((prevTempoRestante) => {
        if (prevTempoRestante === 0) {
          // Tempo expirou, remova as credenciais do usuário
          localStorage.removeItem('username');
          localStorage.removeItem('role');
          localStorage.removeItem('tempo');
          localStorage.removeItem('token');
          return null;
        }
        return prevTempoRestante - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TokenContext.Provider value={{ tempoRestante, setTempoRestante }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
  