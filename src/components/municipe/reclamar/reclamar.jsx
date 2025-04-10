import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message';
import URL from '../../services/url';
import styles from './reclamar.module.css';
import { FiArrowLeft, FiInbox } from 'react-icons/fi';

function Reclamar() {
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [type, setType] = useState();
  const [removeLoading, setRemoveLoading] = useState(true);
  const [formData, setFormData] = useState({
    assunto: "",
    descricao: "",
    idSecretaria: "",
    status: 1,
    valor: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assuntos, setAssuntos] = useState([]);

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const token = localStorage.getItem('token');
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  useEffect(() => {
    async function fetchAssuntos() {
      try {
        const response = await axiosInstance.get('/protoon/assuntos');
        setAssuntos(response.data.map(assunto => ({
          ...assunto,
          valor: assunto.valor_protocolo
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
        valor: selectedAssunto ? selectedAssunto.valor_protocolo : 0
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      console.log("Duplo Click detectado!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1000);

    if (formData.assunto === "") {
      setMessage('Selecione um problema');
      setType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (formData.descricao.length < 3) {
      setMessage('Descreva o Problema!');
      setType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      setRemoveLoading(false);
      const currentDate = new Date();
      let response;

      if (formData.assunto === "Outros") {
        response = await axiosInstance.post(`/protoon/protocolo/abrir-protocolos-reclamar-sem-secretaria`, {
          assunto: formData.assunto,
          descricao: formData.descricao,
          status: formData.status,
          valor: formData.valor,
          data_protocolo: currentDate
        });
      } else {
        response = await axiosInstance.post(`/protoon/protocolo/abrir-protocolos-reclamar/${formData.idSecretaria}`, {
          assunto: formData.assunto,
          descricao: formData.descricao,
          status: formData.status,
          valor: formData.valor,
          data_protocolo: currentDate
        });
      }

      setTimeout(() => {
        setRemoveLoading(true);
        setMessage('Reclamação registrada com sucesso! Redirecionando...');
        setType('success');
        setTimeout(() => navigate('/'), 3000);
      }, 1000);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      setRemoveLoading(true);
      setMessage('Erro ao enviar reclamação. Tente novamente.');
      setType('error');
    }
  };

  const voltarIndex = () => {
    navigate("/");
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reclame Aqui</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Problema:</label>
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
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea
            className={styles.textarea}
            name="descricao"
            placeholder="Ex.: Buraco em minha rua, com risco de acidentes"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>

        {message && <Message type={type} msg={message} />}

        {removeLoading ? (
          <div className={styles.buttonConfirm}>
            <button type="submit" className={styles.button}>
              Confirmar
            </button>

            <button
              className={styles.button}
              onClick={voltarIndex}
            >
              <FiArrowLeft />
              Voltar
            </button>

          </div>
        ) : (
          <div className={styles.loadingContainer}>
            <Loading />
          </div>
        )}
      </form>
    </div>
  );
}

export default Reclamar;