function PaginaInicialMunicipe() {

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', width: 200, alignItems: 'center', margin: 'auto', justifyContent: 'space-between', height: '25vh', padding: 100 }}>
        <button className="btn-log" onClick={() => (window.location.href = '/reclamar')}>Abrir uma Reclamação</button>
        <button className="btn-log" onClick={() => (window.location.href = '/consultar')}>Consultar Reclamações</button>
        <button className="btn-log" onClick={() => (window.location.href = '/retornadas')}>Reclamações Retornadas</button>
      </div>
    </>
  );
}

export default PaginaInicialMunicipe;
