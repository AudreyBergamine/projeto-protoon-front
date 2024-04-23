import PaginaInicial from "../municipe/paginaInicalMunicipe";
function Home({isAuthenticated, role}) {
    //TODO: Criar página inicial de funcionário e implementar a lógica abaixo, igual fiz com a de municipe
     


    
    if(isAuthenticated && role ==="MUNICIPE"){
        return ( <div>
            <PaginaInicial/>
        </div>)
    }


    return (
        <div>
            

                <main>
                    <h1 className="main-title" style={{ marginTop: 200 }}>BEM VINDO AO PROTO-ON</h1>
                    <div className="btn-container">
                        <button className="btn-log" onClick={() => (window.location.href = '/login')}>Login</button>
                        <button className="btn-cad" onClick={() => (window.location.href = '/cadastro')}>Cadastro</button>
                    </div>
                </main>
            
        </div>
    )

}

export default Home;