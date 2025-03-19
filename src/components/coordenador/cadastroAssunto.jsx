import React, { useState, useEffect } from "react";
import axios from 'axios';
import URL from '../services/url';

const CadastroAssunto = () => {
    const [formData, setFormData] = useState({
        problema: '',
        preco: '',
        prioridade: '',
        secretaria: '',
        idSecretaria: null,
    });

    const [secretarias, setSecretarias] = useState([]); // Estado para armazenar a lista de secretarias
    const [loading, setLoading] = useState(false); // Estado para carregamento
    const [error, setError] = useState(null); // Estado para erros

    const axiosInstance = axios.create({
        baseURL: URL,
        withCredentials: true,
    });

    // Busca do banco de dados
    useEffect(() => {
        async function fetchSecretarias() {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/protoon/secretaria');
                setSecretarias(response.data); // Atualiza o estado com as secretarias retornadas
            } catch (error) {
                console.error('Erro ao buscar as secretarias:', error);
                setError('Erro ao carregar as secretarias.');
            } finally {
                setLoading(false);
            }
        }
        fetchSecretarias();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Atualiza o idSecretaria quando a secretaria é selecionada
        if (name === 'secretaria') {
            const selectedSecretaria = secretarias.find(secretaria => secretaria.nome_secretaria === value);
            setFormData(prevState => ({
                ...prevState,
                idSecretaria: selectedSecretaria ? selectedSecretaria.id_secretaria : null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/protoon/assunto', formData);
            console.log('Assunto cadastrado com sucesso:', response.data);
            // Limpar o formulário após o cadastro
            setFormData({
                problema: '',
                preco: '',
                prioridade: '',
                secretaria: '',
                idSecretaria: null,
            });
        } catch (error) {
            console.error('Erro ao cadastrar o assunto:', error);
            setError('Erro ao cadastrar o assunto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Cadastro de Assunto</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Problema:
                        <input
                            type="text"
                            name="problema"
                            value={formData.problema}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Preço:
                        <input
                            type="number"
                            name="preco"
                            value={formData.preco}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Prioridade:
                        <select
                            name="prioridade"
                            value={formData.prioridade}
                            onChange={handleChange}
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
                            style={{ fontSize: 20, padding: 10, borderRadius: 10, textAlign: "center" }}
                            name="secretaria"
                            value={formData.secretaria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione uma secretaria</option>
                            {secretarias.map(secretaria => (
                                <option key={secretaria.id_secretaria} value={secretaria.nome_secretaria}>
                                    {secretaria.nome_secretaria}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
};

export default CadastroAssunto;