import React, { useState, useEffect } from 'react';

const SetCPF = () => {
    const [cpf, setCpf] = useState('');

    useEffect(() => {
        const cpfInputs = document.getElementsByName('cpf');
        cpfInputs.forEach(cpfInput => {
            cpfInput.addEventListener('input', formatCpf);
        });

        return () => {
            cpfInputs.forEach(cpfInput => {
                cpfInput.removeEventListener('input', formatCpf);
            });
        };
    }, []);

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
    };

    return (
        <input
            type="text"
            name="cpf"
            placeholder="Ex.: 333.333.333-33"
            value={cpf}
            onChange={formatCpf}
        />
    );
};

export default SetCPF;
