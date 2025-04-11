import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message';
import URL from '../../services/url';
import styles from './solicitarServico.module.css';
import { FiTool, FiEdit2, FiDollarSign, FiArrowLeft, FiCheck } from 'react-icons/fi';

function SolicitarServico() {
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [type, setType] = useState();
  const [removeLoading, setRemoveLoading] = useState(true);
  const [formData, setFormData] = useState({
    assunto: "",
    descricao: "",
    idSecretaria: "",
    status: 0,
    valor: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axiosInstance = axios.create({
    baseURL: URL, // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });

  // Recuperar o token do localStorage
  const token = localStorage.getItem('token');

  // Adicionar o token ao cabeçalho de autorização
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const [assuntos, setAssuntos] = useState([]);

  // Buscar os assuntos do banco de dados
  useEffect(() => {
    async function fetchAssuntos() {
      try {
        const response = await axiosInstance.get('/protoon/assuntos');
        // Atualiza o estado com os assuntos retornados
        setAssuntos(response.data.map(assunto => ({
          ...assunto,
          valor: assunto.valor_protocolo // Adicionando o campo valor_protocolo como valor
        })));
      } catch (error) {
        console.error('Erro ao buscar os assuntos:', error);
      }
    }
    fetchAssuntos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'assunto') {
      const selectedAssunto = assuntos.find(assunto => assunto.assunto === value);
      setFormData(prevState => ({
        ...prevState,
        idSecretaria: selectedAssunto ? selectedAssunto.secretaria.id_secretaria : null,
        valor: selectedAssunto ? selectedAssunto.valor : null
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (isSubmitting) {
      console.log("Duplo Click detectado!")
      return; // Impede chamadas 
    }
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 1000); // Reativa após 1s
    e.preventDefault();
    // const idMunicipe = localStorage.getItem('idMunicipe');
    // if (!idMunicipe) {
    //   console.error('ID do munícipe não encontrado!');
    //   return;
    // }
    if (formData.assunto === "") {
      setMessage('Selecione um problema');
      setType('error')
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    if (formData.descricao.length < 3) {
      setMessage('Descreva o Problema!');
      setType('error')
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    try {
      let response; // Variável de resposta (não precisa ser inicializada com string vazia)
      const currentDate = new Date(); // Obtém a data e hora atuais (fora do `if` para não repetir código)

      if (formData.assunto === "Outros") {
        response = await axiosInstance.post(`/protoon/protocolo/abrir-protocolos-sem-secretaria`, {
          assunto: formData.assunto,
          descricao: formData.descricao,
          status: formData.status,
          valor: formData.valor,
          data_protocolo: currentDate // Envia a data e hora atuais para data_protocolo
        });
      } else {
        response = await axiosInstance.post(`/protoon/protocolo/abrir-protocolos/${formData.idSecretaria}`, {
          assunto: formData.assunto,
          descricao: formData.descricao,
          status: formData.status,
          valor: formData.valor,
          data_protocolo: currentDate // Envia a data e hora atuais para data_protocolo
        });
      }

      setRemoveLoading(false);
      setTimeout(() => {
        console.log(response.data);
        setRemoveLoading(true);
        setMessage('Solicitação bem sucedida! Redirecionando...');
        setType('success');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FiTool /> Solicitação de Serviço
        </h1>
        <p className={styles.subtitle}>Preencha os detalhes do serviço necessário</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FiTool /> Tipo de Serviço:
          </label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
            >
              <option value="">Selecione um problema</option>
              {assuntos.map(assunto => (
                <option key={assunto.id_assunto} value={assunto.assunto}>
                  {assunto.assunto}
                </option>
              ))}
            </select>
            <span className={styles.selectIcon}></span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FiEdit2 /> Descrição Detalhada:
          </label>
          <textarea
            className={styles.textarea}
            name="descricao"
            placeholder="Descreva o serviço necessário com detalhes (localização, urgência, etc)..."
            value={formData.descricao}
            onChange={handleChange}
            rows={6}
          />
          <div className={styles.charCounter}>
            {formData.descricao.length}/500 caracteres
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FiDollarSign /> Valor do Serviço:
          </label>
          <div className={styles.valueContainer}>
            <input
              type="text"
              className={styles.valueInput}
              value={
                formData.valor !== null && formData.valor !== undefined
                  ? `R$ ${formData.valor.toFixed(2)}`
                  : "Não definido"
              }
              readOnly
            />
          </div>
        </div>

        <div className={styles.notice}>
          <p>O Protocolo será cancelado automaticamente se não for pago em 4 dias corridos.</p>
        </div>

        {message && <Message type={type} msg={message} />}

        <div className={styles.buttonGroup}>
          {removeLoading ? (
            <>
              <button type="submit" className={styles.primaryButton}>
                <FiCheck /> Confirmar Solicitação
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate('/paginaInicial')}
              >
                <FiArrowLeft /> Voltar
              </button>
            </>
          ) : (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SolicitarServico;
