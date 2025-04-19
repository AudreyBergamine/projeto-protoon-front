import React, { useState } from 'react';
import { FiMail, FiSend, FiArrowLeft, FiLock, FiCode } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from './recuperarSenha.module.css';
import Message from '../../layouts/Message';
import Loading from '../../layouts/Loading';
import axios from 'axios';
import URL from '../../services/url';

const RecuperarSenha = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [emailNull, setEmailNull] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

  const solicitarCodigo = async () => {
    try {
      const response = await axiosInstance.post('http://localhost:8080/recuperar-senha/solicitar-codigo', { email });
      setMensagem(response.data.mensagem);
      setEtapa(2);
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || 'Erro ao solicitar código');
    }
  };

  const validarCodigo = async () => {
    try {
      const response = await axiosInstance.post('http://localhost:8080/recuperar-senha/validar-codigo', { email, codigo });
      setMensagem(response.data.mensagem);
      setEtapa(3);
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || 'Código inválido');
    }
  };

  const alterarSenha = async () => {
    try {
      const response = await axiosInstance.post('http://localhost:8080/recuperar-senha/alterar-senha', {
        email,
        codigo,
        novaSenha
      });
      setMensagem(response.data.mensagem);
      setEtapa(1);
      setEmail('');
      setCodigo('');
      setNovaSenha('');
    } catch (error) {
      setMensagem(error.response?.data?.mensagem || 'Erro ao alterar senha');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (etapa === 1) {
        // Etapa 1: Solicitar código
        if (!email) {
          setEmailNull(true);
          setMessage({ text: 'Por favor, insira um email', type: 'error' });
          return;
        }

        try {
          const response = await axiosInstance.post(
            '/protoon/municipe/municipes/recuperarSenha/solicitar-codigo',
            { email }
          );

          if (response.data.mensagem === 'Email não encontrado') {
            setMessage({ text: response.data.mensagem, type: 'error' });
            return
          }

          // Se chegou aqui, o email é válido
          setMessage({ text: response.data.mensagem, type: 'success' });
          setEtapa(2); // Avança para a próxima etapa
        } catch (error) {
          // Aqui o backend retornou um erro (ex: email inválido)
          const mensagemErro = error.response?.data?.mensagem || 'Erro ao enviar o código.';
          setMessage({ text: mensagemErro, type: 'error' });
          setEtapa(1); // Mantém na etapa 1 (opcional, se você quiser garantir)
        }
      }
      else if (etapa === 2) {
        // Etapa 2: Validar código
        if (!codigo) {
          setMessage({ text: 'Por favor, insira o código', type: 'error' });
          return;
        }

        const response = await axiosInstance.post(
          '/protoon/municipe/municipes/recuperarSenha/validar-codigo',
          { email, codigo }
        );

        setMessage({ text: response.data.mensagem, type: 'success' });
        setEtapa(3);
      }
      else {
        // Etapa 3: Alterar senha
        if (!novaSenha) {
          setMessage({ text: 'Por favor, insira uma nova senha', type: 'error' });
          return;
        }

        if (novaSenha.length < 6) {
          setMessage({ text: 'Senha deve conter no minimo 6 digitos', type: 'error' });
          return;
        }

        const response = await axiosInstance.post(
          '/protoon/municipe/municipes/recuperarSenha/alterar-senha',
          { email, codigo, novaSenha }
        );

        setMessage({ text: response.data.mensagem, type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.mensagem || "Ocorreu um erro",
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {etapa === 1 && <><FiMail /> Recuperação de Senha</>}
          {etapa === 2 && <><FiCode /> Verificação de Código</>}
          {etapa === 3 && <><FiLock /> Nova Senha</>}
        </h1>

        <p className={styles.subtitle}>
          {etapa === 1 && 'Digite seu email para receber o código de verificação'}
          {etapa === 2 && 'Insira o código de 6 dígitos enviado para seu email'}
          {etapa === 3 && 'Crie uma nova senha para sua conta'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Etapa 1 - Email */}
          {etapa === 1 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <FiMail /> Email
              </label>
              {emailNull && (
                <div className={styles.alert}>Email é obrigatório</div>
              )}
              <input
                type="email"
                placeholder="Insira o email cadastrado"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                  setEmailNull(false);
                }}
                className={`${styles.input} ${emailNull ? styles.inputError : ''}`}
              />
            </div>
          )}

          {/* Etapa 2 - Código */}
          {etapa === 2 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <FiCode /> Código de Verificação
              </label>
              <input
                type="text"
                placeholder="Insira o código de 6 dígitos"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className={styles.input}
                maxLength={6}
              />
            </div>
          )}

          {/* Etapa 3 - Nova Senha */}
          {etapa === 3 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>
                <FiLock /> Nova Senha
              </label>
              <input
                type="password"
                placeholder="Crie uma nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.buttonGroup}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <>
                <button type="submit" className={styles.primaryButton}>
                  {etapa === 1 && <><FiSend /> Enviar Código</>}
                  {etapa === 2 && <><FiSend /> Verificar Código</>}
                  {etapa === 3 && <><FiSend /> Alterar Senha</>}
                </button>

                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => etapa === 1 ? navigate('/login') : setEtapa(etapa - 1)}
                >
                  <FiArrowLeft /> Voltar
                </button>
              </>
            )}
          </div>

          {message.text && <Message type={message.type} msg={message.text} />}
        </form>
      </div>
    </div>
  );
};

export default RecuperarSenha;