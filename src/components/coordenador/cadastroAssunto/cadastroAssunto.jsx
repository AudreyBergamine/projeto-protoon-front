import React, { useState, useEffect } from "react";
import axios from 'axios';
import URL from '../../services/url';
import styles from './cadastroAssunto.module.css'; // Importando o módulo CSS

const CadastroAssunto = () => {
    const [formData, setFormData] = useState({
        assunto: '',
        valor_protocolo: '',
        prioridade: 0, // Define a prioridade inicial como 1 (BAIXA)
        secretaria: null,
    });    

    const [secretarias, setSecretarias] = useState([]);
    const [prioridades, setPrioridades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const axiosInstance = axios.create({
        baseURL: URL,
        withCredentials: true,
    });

    useEffect(() => {
        async function fetchSecretarias() {
            setLoading(true);
            try {
                const responseSecretarias = await axiosInstance.get('/protoon/secretaria');
                setSecretarias(responseSecretarias.data);
                const responsePrioridades = await axiosInstance.get("protoon/secretaria/prioridades");
                setPrioridades(responsePrioridades.data);

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

        if (name === 'prioridade_id') {
            // Aqui estamos passando o valor da prioridade como um número
            const selectedPrioridade = prioridades.find(prioridade => prioridade.id_prioridade === parseInt(value));
            setFormData({
                ...formData,
                prioridade: selectedPrioridade, // Apenas atualizando com o ID da prioridade
            });
        } else if (name === 'id_secretaria') {
            const selectedSecretaria = secretarias.find(secretaria => secretaria.id_secretaria === parseInt(value));
            setFormData({
                ...formData,
                secretaria: selectedSecretaria,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Assunto cadastrado com sucesso:', formData);
            const response = await axiosInstance.post('/protoon/assuntos/registrar-assunto', formData);
            console.log('Assunto cadastrado com sucesso:', response.data);
            setFormData({
                assunto: '',
                valor_protocolo: '',
                prioridade: '',
                secretaria: null,
            });
        } catch (error) {
            console.error('Erro ao cadastrar o assunto:', error);
            setError('Erro ao cadastrar o assunto.');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    return (
        <div className={styles.containerPrincipal}>
            <div className={styles.containerSecundario}>
                <h1>Cadastro de Assunto</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className={styles.containerTerciario}>
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
                        <label>
                            Prioridade:
                            <select
                                name="prioridade"
                                value={formData.prioridade || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione a prioridade</option>
                                {prioridades.map(prioridade => (
                                    <option key={prioridade.id} value={prioridade.descricao}>
                                        {prioridade.descricao}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Secretaria:
                            <select
                                name="id_secretaria"
                                value={formData.secretaria ? formData.secretaria.id_secretaria : ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione uma secretaria</option>
                                {secretarias.map(secretaria => (
                                    <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                                        {secretaria.nome_secretaria}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button type="submit" style={{ width: 150 }} className={styles.btnLog} disabled={loading}>
                        {loading ? 'Cadastrado' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CadastroAssunto;