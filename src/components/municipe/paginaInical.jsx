function PaginaInicial() {

  return (
    <div>
      <button type="button" style={{ backgroundColor: '#2D9596', fontSize: 30, marginTop: 100 }} className="shadow__btn" onClick={() => (window.location.href = '/reclamar')}>Abrir uma Reclamação</button><br />
      <button type="button" style={{ backgroundColor: '#2D9596', fontSize: 30 }} className="shadow__btn" onClick={() => (window.location.href = '/consultar')}>Consultar Reclamações</button><br />
      <button type="button" style={{ backgroundColor: '#2D9596', fontSize: 30 }} className="shadow__btn" onClick={() => (window.location.href = '/login')}>Voltar</button>
    </div>
  );
}

export default PaginaInicial;
