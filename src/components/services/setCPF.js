import React, { useState } from 'react';

const SetCPF = ({ onCPFChange }) => {
    const [cpf, setCpf] = useState('');

    const formatCpf = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 3) {
            value = value.substring(0, 3) + '.' + value.substring(3);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + '.' + value.substring(7);
        }
        if (value.length > 11) {
            value = value.substring(0, 11) + '-' + value.substring(11);
        }
        if (value.length > 14) {
            return
        }
        setCpf(value);
        onCPFChange(value); // Chama a função de callback com o valor formatado do CPF
    };

    return (
        <input
            type="text"
            name="cpf"
            placeholder="Ex.: 333.333.333-33"
            value={cpf}
            onChange={formatCpf}
            required
            minLength={14}
        />
    );
};

export default SetCPF;
