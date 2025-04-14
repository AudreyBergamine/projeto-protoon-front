import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message';
import URL from '../../services/url';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import styles from './recuperarSenha.module.css';

function RecuperarSenha() {
  const [message, setMessage] = useState();
  const [type, setType] = useState();
  const [alert, setAlert] = useState('');
  const [emailNull, setEmailNull] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(true);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const token = localStorage.getItem('token');
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    email: ""
  });

  useEffect(() => {
    setFormData({
      ...formData,
      email: email
    });
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email) {
      setAlert('Por favor, preencha o email!');
      setEmailNull(true);
      setTimeout(() => {
        setEmailNull(false);
        setAlert('');
      }, 3000);
      return;
    } else if (!isValidEmail(email)) {
      setAlert('Por favor, insira um email válido!');
      setEmailNull(true);
      setTimeout(() => {
        setEmailNull(false);
        setAlert('');
      }, 3000);
      return;
    }

    try {
      const response = await axiosInstance.post(URL + '/protoon/municipe/municipes/recuperarSenha/', {
        email: email
      });

      setRemoveLoading(false);
      if (response.data === "Email não encontrado!") {
        setTimeout(() => {
          setRemoveLoading(true);
          setMessage('Email não encontrado.');
          setType('error');
        }, 3000);
      } else {
        setTimeout(() => {
          setRemoveLoading(true);
          navigate('/atualizar-senha');
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao buscar os usuários:", error);
      setMessage('Erro ao buscar email!');
      setType('error');
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          <FiMail /> Recuperação de Senha
        </h1>
        <p className={styles.subtitle}>Digite seu email para receber o link de recuperação</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <FiMail /> Email
            </label>
            {emailNull && (
              <div className={styles.alert}>{alert}</div>
            )}
            <input
              type="text"
              name="email"
              placeholder="Insira o email cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className={`${styles.input} ${emailNull ? styles.inputError : ''}`}
            />
          </div>

          <div className={styles.buttonGroup}>
            {removeLoading ? (
              <>
                <button type="submit" className={styles.primaryButton}>
                  <FiSend /> Enviar
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => navigate('/login')}
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

          {message && <Message type={type} msg={message} />}
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenha;