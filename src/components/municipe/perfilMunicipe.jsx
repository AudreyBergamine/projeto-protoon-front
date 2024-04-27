import axios from "axios";
import { useEffect, useState } from "react";
import URL from '../services/url';

function PerfilMunicipe(){
    
  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    num_CPF: "",
    celular: "",
    data_nascimento: "",
    endereco: {
      tipo_endereco: "",
      num_cep: "",
      logradouro: "",
      nome_endereco: "",
      num_endereco: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      pais: ""
    }
  });

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/protoon/municipe/municipes/bytoken`);
      const data = response.data;
      setFormData(data);
    } catch (error) {
      console.error('Erro ao obter dados do perfil:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    // Lógica para lidar com mudanças nos campos do formulário, se necessário
  };
  
  const handleEnderecoChange = (logradouro, bairro, cidade, estado, pais) => {
    setFormData({
      ...formData,
      endereco: {
        ...formData.endereco,
        logradouro,
        bairro,
        cidade,
        estado,
        pais: "Brasil"
      }
    });
  };

  return (
    <div>
      <h2>Perfil do Munícipe</h2>
      <p>Nome: {formData.nome}</p>
      <p>Email: {formData.email}</p>
      <p>CPF: {formData.num_CPF}</p>
      {/* Outros campos do perfil aqui */}
    </div>
  );
}

export default PerfilMunicipe;
