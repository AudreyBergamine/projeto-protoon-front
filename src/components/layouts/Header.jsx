function Header(){
    return (
        <div>
            
                <header className="header">
                    <div className="title-proton"><a href="/" >PROTO-ON</a></div>
                    <nav>
                        <ul className="nav-links">
                            <li>
                                <a href="#">Serviços</a>
                                <ul className="submenu">
                                    <li><a href="./reclamar">Abrir reclamação</a></li>
                                    <li><a href="/consultar">Consultar protocolos</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Mais</a>
                                <ul className="submenu">
                                    <li><a href="./contato">Contato</a></li>
                                    <li><a href="./sobreNos">Sobre nós</a></li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </header>
                </div>
                )
}
export default Header;