import React, { useState } from 'react';

const CadastroAssunto = () => {
    const [problema, setProblema] = useState('');
    const [preco, setPreco] = useState('');
    const [prioridade, setPrioridade] = useState('');
    const [secretaria, setSecretaria] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para enviar os dados do formulário
        console.log({
            problema,
            preco,
            prioridade,
            secretaria,
        });
    };

    return (
        <div>
            <h1>Cadastro de Assunto</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Problema:
                        <input
                            type="text"
                            value={problema}
                            onChange={(e) => setProblema(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Preço:
                        <input
                            type="number"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Prioridade:
                        <select
                            value={prioridade}
                            onChange={(e) => setPrioridade(e.target.value)}
                            required
                        >
                            <option value="">Selecione a prioridade</option>
                            <option value="Baixa">Baixa</option>
                            <option value="Média">Média</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Secretaria:
                        <select
                            value={secretaria}
                            onChange={(e) => setSecretaria(e.target.value)}
                            required
                        >
                            <option value="">Selecione uma secretaria</option>
                            <option value="Secretaria A">Secretaria A</option>
                            <option value="Secretaria B">Secretaria B</option>
                            <option value="Secretaria C">Secretaria C</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};

export default CadastroAssunto;