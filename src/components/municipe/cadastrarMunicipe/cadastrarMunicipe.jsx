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
import { 
  FaUser, FaEnvelope, FaLock, FaIdCard, 
  FaPhone, FaCalendarAlt, FaMapMarkerAlt,
  FaHome, FaBuilding, FaGlobeAmericas, FaSignInAlt, FaArrowLeft,
  FaHashtag, FaCheckCircle, FaRoad, FaCity, FaFlag
} from 'react-icons/fa';

function CadastrarMunicipe() {
  // const [message, setPopupMessage] = useState();
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
      setPopupMessage('CPF Inválido');
      setShowPopup(true);
      setType('error');
      return;
    }

    setPopupMessage('');
    setShowPopup(true);

    const birthDate = moment(formData.data_nascimento);
    const currentDate = moment();
    const diffYears = currentDate.diff(birthDate, 'years');
    if (diffYears < 5) {
      setPopupMessage('Idade mínima requerida é de 5 anos');
      setShowPopup(true);
      setType('error');
      setTimeout(() => setShowPopup(false), 3000);
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
        setPopupMessage('Redirecionando para login...');
        setShowPopup(true);
        setType('success');
        setTimeout(() => navigate('/login'), 2000);
      }, 2000);
    } catch (error) {
      setRemoveLoading(false);
      setTimeout(() => {
        setRemoveLoading(true);
        console.error('Erro ao enviar os dados:', error);
        if (error.response?.data?.message) {
          setPopupMessage(error.response.data.message);
          setShowPopup(true);
        } else {
          setPopupMessage('Falha ao tentar fazer o cadastro!');
          setShowPopup(true);
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
        {/* Seção Dados Pessoais */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <FaUser /> Dados Pessoais
          </h3>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label><FaUser /> Nome:</label>
              <input
                type="text"
                name="nome"
                placeholder="Ex.: Cláudio Silva"
                value={formData.nome}
                onChange={(e) => handleChangeNome(e.target.value)}
                required
                minLength={3}
              />
              <span className={styles.inputIcon}><FaUser /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaEnvelope /> Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Ex.: claudio.silva@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
                minLength={7}
              />
              <span className={styles.inputIcon}><FaEnvelope /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaLock /> Senha:</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={6}
              />
              <span className={styles.inputIcon}><FaLock /></span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label><FaIdCard /> CPF:</label>
              <SetCPF
                cpfValido={handleCpfValidChange}
                onCPFChange={(formattedCPF) => {
                  setFormData({ ...formData, num_CPF: formattedCPF })
                }}
              />
              <span className={styles.inputIcon}><FaIdCard /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaPhone /> Celular:</label>
              <SetCelular
                onCelularChange={(formattedCelular) => {
                  setFormData({ ...formData, celular: formattedCelular })
                }}
              />
              <span className={styles.inputIcon}><FaPhone /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaCalendarAlt /> Data Nasc.:</label>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
              />
              <span className={styles.inputIcon}><FaCalendarAlt /></span>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Seção Endereço */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <FaMapMarkerAlt /> Endereço
          </h3>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label><FaMapMarkerAlt /> CEP:</label>
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
              <span className={styles.inputIcon}><FaMapMarkerAlt /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaRoad /> Logradouro:</label>
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
              <span className={styles.inputIcon}><FaRoad /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaHashtag /> Número:</label>
              <input
                type="number"
                name="num_endereco"
                placeholder="Ex.: 1025"
                value={formData.endereco.num_endereco}
                onChange={handleChange}
                required
                min={1}
              />
              <span className={styles.inputIcon}><FaHashtag /></span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label><FaHome /> Complemento:</label>
              <input
                type="text"
                name="complemento"
                placeholder="Bloco / Apartamento..."
                value={formData.endereco.complemento}
                onChange={handleChange}
              />
              <span className={styles.inputIcon}><FaHome /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaBuilding /> Tipo:</label>
              <input
                type="text"
                name="tipo_endereco"
                placeholder="Ex.: Casa / Apartamento"
                value={formData.endereco.tipo_endereco}
                onChange={handleChange}
                minLength={3}
                required
              />
              <span className={styles.inputIcon}><FaBuilding /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaCity /> Bairro:</label>
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
              <span className={styles.inputIcon}><FaCity /></span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label><FaCity /> Cidade:</label>
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
              <span className={styles.inputIcon}><FaCity /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaFlag /> Estado:</label>
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
              <span className={styles.inputIcon}><FaFlag /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaGlobeAmericas /> País:</label>
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
              <span className={styles.inputIcon}><FaGlobeAmericas /></span>
            </div>
          </div>
        </div>

        {/* Ações do Formulário */}
        <div className={styles.formActions}>
          {/* {message && <Message type={type} msg={message} />} */}

          {removeLoading ? (
            <>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                <FaSignInAlt /> {isSubmitting ? 'Cadastrando...' : 'Cadastrar-se'}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate("/login")}
              >
                <FaArrowLeft /> Voltar para Login
              </button>
            </>
          ) : (
            <Loading />
          )}
        </div>
      </form>

      {/* Popup de sucesso */}
      <div className={`${styles.popup} ${showPopup ? styles.showPopup : ''}`}>
        <div className={styles.popupContent}>
          <FaCheckCircle /> <span>{popupMessage}</span>
        </div>
      </div>

      {/* Mensagem de erro */}
      <div className={`${styles.popupError} ${showPopup ? styles.showPopup : ''}`}>
        <div className={styles.popupContent}>
          <FaCheckCircle /> <span>{popupMessage}</span>
        </div>
      </div>
    </div>
  );
}



export default CadastrarMunicipe;