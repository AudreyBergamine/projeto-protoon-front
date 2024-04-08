import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SetCEP = ({ onEnderecoChange }) => {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState({
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
    });

    useEffect(() => {
        const cepInput = document.getElementsByName('cep');
        cepInput.forEach(cepInput => {
            cepInput.addEventListener('input', formatCep);
        });

        return () => {
            cepInput.forEach(cepInput => {
                cepInput.removeEventListener('input', cepInput);
            });
        };
    }, []);

    const formatCep = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5);
        }
        if (value.length > 9) {
            return
        }
        setCep(value);
    };

    useEffect(() => {
        if (cep.length === 9) {
            buscarEndereco();
        }
    }, [cep]);

    const buscarEndereco = async () => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;
    
            if (!data.erro) {
                setEndereco({
                    logradouro: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf,
                });
                onEnderecoChange(data.logradouro, data.bairro, data.localidade, data.uf);
            } else {
                setEndereco({
                    logradouro: '',
                    bairro: '',
                    cidade: '',
                    estado: '',
                });
                alert('CEP não encontrado.');
            }
        } catch (error) {
            setEndereco({
                logradouro: '',
                bairro: '',
                cidade: '',
                estado: '',
            });
            alert('Erro ao buscar CEP.');
        }
    };

    return (
        <>
            <input
                type="text"
                name="cep"
                placeholder="Ex.: 08500-000"
                value={cep}
                onChange={formatCep}
            />
        </>
    );
};

export default SetCEP;
