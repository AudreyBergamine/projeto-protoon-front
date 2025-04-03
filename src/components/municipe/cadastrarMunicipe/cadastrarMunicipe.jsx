import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import SetCelular from "../../services/setCelular";
import SetCPF from "../../services/setCPF";
import SetCEP from "../../services/setCEP";
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message';
import URL from '../../services/url';
import styles from './cadastrarMunicipe.module.css';

function CadastrarMunicipe() {
  const [message, setMessage] = useState();
  const [type, setType] = useState();
  const [removeLoading, setRemoveLoading] = useState(true);
  const [cpfValid, setCpfValid] = useState(false);
  const [alert, setAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

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
      nome_endereco: null,
      num_endereco: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      pais: ""
    }
  });

  const handleAlertChange = (newAlert) => {
    setAlert(newAlert);
  };

  const handleCpfValidChange = (isCpfValid) => {
    setCpfValid(isCpfValid);
  };

  const handleEnderecoChange = (logradouro, bairro, cidade, estado) => {
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

  const formatValue = (value) => {
    return value.toLowerCase()
      .replace(/( de | da | do | das | dos )/g, (match) => match.toLowerCase())
      .replace(/\b(?!de |da |do |das |dos )\w/g, (char) => char.toUpperCase())
      .replace(/(à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ñ|ò|ó|ô|õ|ö|ø|ù|ú|û|ü|ý|ÿ)\w/g, (match) => match.toLowerCase());
  };

  const handleChange = (e) => {
    const enderecoFields = ['tipo_endereco', 'num_cep', 'logradouro', 'nome_endereco', 'num_endereco', 'complemento', 'bairro', 'cidade', 'estado', 'pais'];
    const { name, value } = e.target;

    let formattedValue = formatValue(value);

    if (enderecoFields.includes(name)) {
      setFormData({
        ...formData,
        endereco: {
          ...formData.endereco,
          [name]: formattedValue
        }
      });
    } else {
      if (name === 'email') {
        setFormData({
          ...formData,
          [name]: value.toLowerCase()
        });
      } else {
        setFormData({
          ...formData,
          [name]: formattedValue
        });
      }
    }
  };

  const handleChangePais = (pais) => {
    if (/^[a-zA-Z\s]*$/.test(pais)) {
      const formattedPais = formatValue(pais);
      setFormData({
        ...formData,
        endereco: {
          ...formData.endereco,
          pais: formattedPais
        }
      });
    }
  };

  const handleChangeNome = (nome) => {
    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/.test(nome)) {
      const formattedNome = formatValue(nome);
      setFormData({
        ...formData,
        nome: formattedNome
      });
    }
  };

  const handleSubmit = async (e) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    e.preventDefault();
    if (!cpfValid) {
      setMessage('CPF Inválido');
      setType('error');
      return;
    }

    setMessage('');

    const birthDate = moment(formData.data_nascimento);
    const currentDate = moment();
    const diffYears = currentDate.diff(birthDate, 'years');
    if (diffYears < 5) {
      setMessage('Idade mínima requerida é de 5 anos');
      setType('error');
      return;
    }

    try {
      const formattedDate = moment(formData.data_nascimento).format('YYYY-MM-DD');
      await axiosInstance.post('/protoon/auth/register/municipe', {
        ...formData,
        data_nascimento: formattedDate,
      });

      setRemoveLoading(false);
      setPopupMessage('Cadastro realizado com sucesso!');
      setShowPopup(true);

      setTimeout(() => {
        setRemoveLoading(true);
        setMessage('Redirecionando para login...');
        setType('success');
        setTimeout(() => navigate('/login'), 2000);
      }, 2000);
    } catch (error) {
      setRemoveLoading(false);
      setTimeout(() => {
        setRemoveLoading(true);
        console.error('Erro ao enviar os dados:', error);
        if (error.response?.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Falha ao tentar fazer o cadastro!');
        }
        setType('error');
      }, 2000);
    } finally {
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Dados Pessoais</h3>

          <div className={styles.inputGroup}>
            
            <div className={styles.inputField}>
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                placeholder="Ex.: Cláudio Silva"
                value={formData.nome}
                onChange={(e) => handleChangeNome(e.target.value)}
                required
                minLength={3}
              />
            </div>

            <div className={styles.inputField}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Ex.: claudio.silva@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                minLength={7}
              />
            </div>

            <div className={styles.inputField}>
              <label>Senha:</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label>CPF:</label>
              <SetCPF
                cpfValido={handleCpfValidChange}
                onCPFChange={(formattedCPF) => {
                  setFormData({ ...formData, num_CPF: formattedCPF })
                }}
              />
            </div>

            <div className={styles.inputField}>
              <label>Celular:</label>
              <SetCelular
                onCelularChange={(formattedCelular) => {
                  setFormData({ ...formData, celular: formattedCelular })
                }}
              />
            </div>

            <div className={styles.inputField}>
              <label>Data de Nascimento:</label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Endereço</h3>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label>CEP:</label>
              <SetCEP
                onAlertChange={handleAlertChange}
                onEnderecoChange={handleEnderecoChange}
                onCEPChange={(formattedCEP) => {
                  setFormData({
                    ...formData,
                    endereco: {
                      ...formData.endereco,
                      num_cep: formattedCEP
                    }
                  })
                }}
              />
            </div>

            <div className={styles.inputField}>
              <label>Logradouro:</label>
              <input
                type="text"
                name="logradouro"
                placeholder="Ex.: Rua 23 de Maio"
                value={formData.endereco.logradouro}
                onChange={handleChange}
                required
                readOnly={alert === ''}
                className={alert === '' ? styles.readOnly : ''}
              />
            </div>

            <div className={styles.inputField}>
              <label>Número:</label>
              <input
                type="number"
                name="num_endereco"
                placeholder="Ex.: 1025"
                value={formData.endereco.num_endereco}
                onChange={handleChange}
                required
                min={1}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label>Complemento:</label>
              <input
                type="text"
                name="complemento"
                placeholder="Bloco / Apartamento..."
                value={formData.endereco.complemento}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputField}>
              <label>Tipo:</label>
              <input
                type="text"
                name="tipo_endereco"
                placeholder="Ex.: Casa / Apartamento"
                value={formData.endereco.tipo_endereco}
                onChange={handleChange}
                minLength={3}
                required
              />
            </div>

            <div className={styles.inputField}>
              <label>Bairro:</label>
              <input
                type="text"
                name="bairro"
                placeholder="Ex.: Bairro das Flores"
                value={formData.endereco.bairro}
                onChange={handleChange}
                required
                minLength={2}
                readOnly={alert === ''}
                className={alert === '' ? styles.readOnly : ''}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label>Cidade:</label>
              <input
                type="text"
                name="cidade"
                placeholder="Ex.: Ferraz de Vasconcelos"
                value={formData.endereco.cidade}
                onChange={handleChange}
                required
                minLength={2}
                readOnly={alert === ''}
                className={alert === '' ? styles.readOnly : ''}
              />
            </div>

            <div className={styles.inputField}>
              <label>Estado:</label>
              <input
                type="text"
                name="estado"
                placeholder="Ex.: São Paulo"
                value={formData.endereco.estado}
                onChange={handleChange}
                required
                minLength={2}
                readOnly={alert === ''}
                className={alert === '' ? styles.readOnly : ''}
              />
            </div>

            <div className={styles.inputField}>
              <label>País:</label>
              <input
                type="text"
                name="pais"
                placeholder="Ex.: Brasil"
                value={formData.endereco.pais || ""}
                readOnly={alert === ''}
                className={alert === '' ? styles.readOnly : ''}
                onChange={(e) => handleChangePais(e.target.value)}
                required
                minLength={3}
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          {message && <Message type={type} msg={message} />}
          {!removeLoading && <Loading />}

          {removeLoading && (
            <>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar-se'}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate("/login")}
              >
                Voltar para Login
              </button>
            </>
          )}
        </div>
      </form>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Proto-on. Todos os direitos reservados.
      </footer>

      {/* Popup de sucesso */}
      <div className={`${styles.popup} ${showPopup ? styles.showPopup : ''}`}>
        <div className={styles.popupContent}>
          <span>{popupMessage}</span>
        </div>
      </div>
    </div>
  );
}

export default CadastrarMunicipe;