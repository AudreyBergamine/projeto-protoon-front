function SobreNos() {

  return (
    <div>
      <h1>Sobre Nós</h1>
      <button type="button" style={{ backgroundColor: '#2D9596', fontSize: 30 }} className="shadow__btn" onClick={() => (window.location.href = '/paginaInicial')}>Voltar</button>
    </div>
  );
}

export default SobreNos;
