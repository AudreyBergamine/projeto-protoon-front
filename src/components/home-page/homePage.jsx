function Home() {
    return (
        <div>
            

                <main>
                    <h1 className="main-title">BEM VINDO AO PROTO-ON</h1>
                    <div className="btn-container">
                        <button className="btn-log" onClick={() => (window.location.href = '/login')}>Login</button>
                        <button className="btn-cad" onClick={() => (window.location.href = '/cadastro')}>Cadastro</button>
                    </div>
                </main>
            
        </div>
    )

}

export default Home;