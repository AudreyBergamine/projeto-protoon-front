import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { useNavigate, Link } from "react-router-dom";
import URL from '../../services/url';
import axios from 'axios';
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message';
import styles from './login.module.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${URL}/protoon/auth/authenticate`, {
        email: email.toLowerCase(),
        senha: password
      }, { withCredentials: true });

      if (response.data.role !== 'MUNICIPE') {
        const userData = await axios.get(`${URL}/protoon/funcionarios/${response.data.id}`, {
          headers: { Authorization: `Bearer ${response.data.access_token}` }
        });
        localStorage.setItem("nome_secretaria", userData.data.secretaria.nome_secretaria);
      }

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);

      setMessage('Login realizado com sucesso!');
      setMessageType('success');
      setTimeout(() => window.location.href = '/', 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao fazer login');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Bem-vindo de volta</h1>
          <p className={styles.loginSubtitle}>Entre na sua conta para continuar</p>
        </div>

        {message && <Message type={messageType} msg={message} />}

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                className={styles.inputField}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Senha</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                className={styles.inputField}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                minLength="6"
                required
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
            <Link to="/recuperar-senha" className={styles.forgotPassword}>
              Esqueceu sua senha?
            </Link>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/cadastrar-municipe')}
            >
              Criar nova conta
            </button>
          </div>

          <div className={styles.divider}>ou continue com</div>

          <div className={styles.socialLogin}>
            <div className={styles.socialIcon}>
              <FaGoogle color="#DB4437" size={20} />
            </div>
            <div className={styles.socialIcon}>
              <FaFacebook color="#4267B2" size={20} />
            </div>
            <div className={styles.socialIcon}>
              <FaApple color="#000000" size={20} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;