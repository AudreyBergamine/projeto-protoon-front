import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message';
import URL from '../../services/url';
import styles from './solicitarServico.module.css';
import { FiAlertCircle, FiEdit2, FiArrowLeft, FiCheck, FiPaperclip,FiDollarSign } from 'react-icons/fi';


function SolicitarServico() {
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
  const [files, setFiles] = useState([]);


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

      const protocoloId = response.data.id_protocolo;

      if (files.length > 0) {
        const formDataFiles = new FormData();
        files.forEach(file => formDataFiles.append("files", file));

        try {
          await axiosInstance.post(`/protoon/documentos/${protocoloId}/multiplos`, formDataFiles, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
        } catch (error) {
          console.log("Protocolo ID:", protocoloId);
          console.error('Erro ao enviar documentos:', error);
          setMessage('Protocolo criado, mas falha ao anexar documentos.');
          setType('error');
        }
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

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FiAlertCircle /> Solicite o seu Serviço
        </h1>
        <p className={styles.subtitle}>Nos conte o que precisa!</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FiAlertCircle /> Tipo de Serviço:
          </label>
          <div className={styles.selectContainer}>
            <select
              className={styles.select}
              name="assunto"
              value={formData.assunto}
              onChange={handleChange}
            >
              <option value="">Selecione seu pedido</option>
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
            placeholder="Descreva o problema com detalhes (localização, horário, etc)..."
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

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            <FiPaperclip /> Anexar documentos:
          </label>
          <input
            type="file"
            multiple
            className={styles.fileInput}
            name="documentos"
            onChange={handleFileChange}
          />
        </div>

        <div className={styles.notice}>
          <p>O Protocolo será cancelado automaticamente se não for pago em 4 dias corridos.</p>
        </div>


        {message && <Message type={type} msg={message} />}

        <div className={styles.buttonGroup}>
          {removeLoading ? (
            <>
              <button type="submit" className={styles.primaryButton}>
                <FiCheck /> Solicitar Serviço
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={voltarIndex}
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