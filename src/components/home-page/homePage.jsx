function Home() {
    return (
        <div>
            
                <header className="header">
                    <div className="title-proton">PROTO-ON</div>
                    <nav>
                        <ul className="nav-links">
                            <li>
                                <a href="#">Serviços</a>
                                <ul className="submenu">
                                    <li><a href="#">Abrir reclamação</a></li>
                                    <li><a href="#">Consultar protocolos</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Mais</a>
                                <ul className="submenu">
                                    <li><a href="#">Contato</a></li>
                                    <li><a href="#">Sobre nós</a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </header>

                <main>
                    <h1 className="main-title">BEM VINDO AO PROTO-ON</h1>
                    <div className="btn-container">
                        <button className="btn-log" onClick={() => (window.location.href = '/login')}>Login</button>
                        <button className="btn-cad" onClick={() => (window.location.href = '/cadastro')}>Cadastro</button>
                    </div>
                </main>

                <footer className="footer">
                    © 2024 Proto-on. Todos os direitos reservados.
                </footer>
            
        </div>
    )

}

export default Home;