// src/utils/verificaAlertas.js

export function verificarStatusAlerta(protocolos) {
    const agora = new Date();
  
    const protocolosAtualizados = protocolos.map(protocolo => {
      if (protocolo.data_protocolo && protocolo.prazoConclusao !== null) {
        const dataLimite = new Date(protocolo.prazoConclusao);
        const prazoRestante = Math.ceil((dataLimite - agora) / (1000 * 60 * 60 * 24));
        return { ...protocolo, prazoRestante };
      }
      return { ...protocolo, prazoRestante: null };
    });
  
    const temVencido = protocolosAtualizados.some(
      (p) => p.prazoConclusao && new Date(p.prazoConclusao) < agora && p.status !== "CONCLUIDO"
    );
  
    const temProximo = protocolosAtualizados.some(
      (p) => {
        const dataLimite = new Date(p.prazoConclusao);
        return (
          p.prazoConclusao &&
          dataLimite >= agora &&
          dataLimite <= new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000) &&
          p.status !== "CONCLUIDO"
        );
      }
    );
  
    const prazoMenorQue3Dias = protocolosAtualizados.some(
      (p) => p.prazoRestante !== null && p.prazoRestante < 4 && p.status !== "CONCLUIDO"
    );
  
    if (prazoMenorQue3Dias || temVencido) {
      return "vermelho";
    } else if (temProximo) {
      return "amarelo";
    } else {
      return "transparente";
    }
  }
  