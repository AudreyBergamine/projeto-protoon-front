// import { useState } from 'react';
import { useEffect } from 'react';

const FormsComplete = () => {
    // const [formData, setFormData] = useState({
    //     endereco: {
    //         rua: "",
    //         bairro: "",
    //         cidade: "",
    //         uf: ""
    //     }
    // });

    // function limpa_formulario_cep() {
    //     setFormData({
    //         ...formData,
    //         endereco: {
    //             rua: "",
    //             bairro: "",
    //             cidade: "",
    //             uf: ""
    //         }
    //     });
    // }    

    function setProblema(problema) {
        problema.addEventListener('change', function () {
            var selectedText = this.options[this.selectedIndex].textContent;
            var problemaTextElement = document.getElementById('problema_text');

            if (selectedText !== "Problemas") {
                problemaTextElement.value = selectedText;
                document.getElementById('problema-error').textContent = '';
            } else {
                problemaTextElement.value = '';
                document.getElementById('problema-error').textContent = 'Por favor, selecione um problema';
            }
        });
    }

    useEffect(() => {      
        setEndereco(document.getElementById('cep'));
        setProblema(document.getElementById('problema'));
    }, []);

    return null; // Você pode retornar qualquer coisa aqui, dependendo de como deseja estruturar seu componente
};

export function setEndereco(cep) {
    // Implemente a lógica para preencher os campos de endereço com base no CEP aqui
}

export default FormsComplete;
