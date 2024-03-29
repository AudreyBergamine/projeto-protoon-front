function Consultar() {

  return (
    <div>
      <button type="button" style={{ backgroundColor: '#2D9596', fontSize: 30, marginTop: 100 }} className="shadow__btn" onClick={() => (window.location.href = '/consultar')}>Consultar</button><br />
      <button type="button" style={{ backgroundColor: '#2D9596', fontSize: 30 }} className="shadow__btn" onClick={() => (window.location.href = '/paginaInicial')}>Voltar</button>
    </div>
  );
}

export default Consultar;
