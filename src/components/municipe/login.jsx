import React, {useState, useEffect, ChangeEvent, FormEvent, ReactNode} from "react"

function LoginForm() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aqui você pode adicionar a lógica para autenticar o usuário com o username e password fornecidos.
        console.log('Username:', email);
        console.log('Password:', senha);
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;