function Home() {
    return (
        <div>
            <body>
                <header class="header">
                    <div class="title-proton">PROTO-ON</div>
                    <nav>
                        <ul class="nav-links">
                            <li>
                                <a href="#">Serviços</a>
                                <ul class="submenu">
                                    <li><a href="#">Abrir reclamação</a></li>
                                    <li><a href="#">Consultar protocolos</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Mais</a>
                                <ul class="submenu">
                                    <li><a href="#">Contato</a></li>
                                    <li><a href="#">Sobre nós</a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </header>

                <main>
                    <h1 class="main-title">BEM VINDO AO PROTO-ON</h1>
                    <div class="btn-container">
                        <button class="btn-log" onClick={() => (window.location.href = '/login')}>Login</button>
                        <button class="btn-cad" onClick={() => (window.location.href = '/cadastro')}>Cadastro</button>
                    </div>
                </main>

                <footer class="footer">
                    © 2024 Proto-on. Todos os direitos reservados.
                </footer>
            </body>
        </div>
    )

}

export default Home;