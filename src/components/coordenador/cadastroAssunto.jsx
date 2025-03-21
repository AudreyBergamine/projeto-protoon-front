import React, { useState, useEffect } from "react";
import axios from 'axios';
import URL from '../services/url';
import '../css/cadastroAssunto.css';

const CadastroAssunto = () => {
    const [formData, setFormData] = useState({
        assunto: '',
        valor_protocolo: '',
        prioridade: '',
        id_secretaria: 0, // Mantém o id_secretaria
    });

    const [secretarias, setSecretarias] = useState([]); // armazena a lista de secretarias
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/protoon/assuntos/registrar-assunto', formData);
            console.log('Assunto cadastrado com sucesso:', response.data);
            // Limpa o formulário após o cadastro
            setFormData({
                assunto: '',
                valor_protocolo: '',
                prioridade: '',
                id_secretaria: 0,
            });
        } catch (error) {
            console.error('Erro ao cadastrar o assunto:', error);
            setError('Erro ao cadastrar o assunto.');
            console.log(handleSubmit)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="containerPrincipal">
            <div className="containerSecundario">
                <h1>Cadastro de Assunto</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="containerTerciario">
                        <div>
                            <label>
                                Assunto:
                                <input
                                    type="text"
                                    name="assunto"
                                    value={formData.assunto}
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
                                    name="valor_protocolo"
                                    value={formData.valor_protocolo}
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
                                    <option value="BAIXA">Baixa</option>
                                    <option value="MEDIA">Média</option>
                                    <option value="ALTA">Alta</option>
                                    <option value="URGENTE">Urgente</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                Secretaria:
                                <select
                                    name="id_secretaria"
                                    value={formData.id_secretaria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={''}>Selecione uma secretaria</option>
                                    {secretarias.map(secretaria => (
                                        <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                                            {secretaria.nome_secretaria}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn-log" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CadastroAssunto;
