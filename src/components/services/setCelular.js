import React, { useEffect, useState } from 'react';

const SetCelular = ({ celularId }) => {

    const [celular, setCelular] = useState('');

    useEffect(() => {
        const celularInputs = document.getElementsByName('celular');
        celularInputs.forEach(celularInputs => {
            celularInputs.addEventListener('input', formatCelular);
        });
        return () => {
            celularInputs.forEach(celularInputs => {
                celularInputs.removeEventListener('input', formatCelular);
            });
        };
    }, []);

    const formatCelular = (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '(' + value;
        }
        if (value.length > 3) {
            value = value.substring(0, 3) + ') ' + value.substring(3);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + '-' + value.substring(10);
        }
        if (value.length > 15) {
            return
        }
        setCelular(value);
    };

    return (
        <input
            type="text"
            name="celular"
            placeholder="Ex.: (11)99999-9999"
            value={celular}
            onChange={formatCelular}
        />
    );
};

export default SetCelular;
