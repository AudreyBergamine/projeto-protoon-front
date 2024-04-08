function Consultar() {

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', width: 200, alignItems: 'center', margin: 'auto', justifyContent: 'space-between', height: '30vh', padding: 100 }}>
        <button className="btn-log" onClick={() => (window.location.href = '/consultar')}>Consultar</button>
        <button className="btn-log" onClick={() => (window.location.href = '/paginaInicial')}>Voltar</button>
      </div>
    </>
  );
}

export default Consultar;
