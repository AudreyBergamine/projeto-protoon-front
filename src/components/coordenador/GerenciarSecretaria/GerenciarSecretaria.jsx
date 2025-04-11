import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SetCEP from "../../services/setCEP";
import Loading from '../../layouts/Loading';
import Message from '../../layouts/Message'
import URL from '../../services/url';
import {
  FaBuilding, FaUserTie, FaEnvelope, FaMapMarkerAlt,
  FaHashtag, FaHome, FaCity, FaFlag, FaGlobeAmericas,
  FaSignInAlt, FaArrowLeft,FaRoad
} from 'react-icons/fa';
import styles from './GerenciarSecretaria.module.css'

//Função de cadastro de municipe
function GerenciarSecretaria() {
  const [message, setMessage] = useState()
  const [type, setType] = useState()
  const [removeLoading, setRemoveLoading] = useState(true)
  const [endereco, setEndereco] = useState();
  const [alert, setAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [secretarias, setSecretarias] = useState([]);

  const axiosInstance = axios.create({
    baseURL: URL, // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });
  //Este campo abaixo é um objeto em json que é enviado ao backend para requisitar o cadastro!
  const [formData, setFormData] = useState({
    nome_secretaria: "",
    nome_responsavel: "",
    email: "",
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

  useEffect(() => {
    const fetchSecretarias = async () => {
      try {
        const response = await axiosInstance.get("protoon/secretaria/listar-secretarias");
        setSecretarias(response.data); // Define os dados corretamente
      } catch (error) {
        console.error("Erro ao buscar secretarias:", error);
      }
    };

    fetchSecretarias();
  }, []);

  useEffect(() => {
    setEndereco('num_cep')
  }, []);

  const formatValue = (value) => {
    // Converter para minúsculas e manter "de", "da", "do", "das" e "dos" em minúsculo quando estiverem separados da palavra
    return value.toLowerCase().replace(/( de | da | do | das | dos )/g, (match) => match.toLowerCase())
      .replace(/\b(?!de |da |do |das |dos )\w/g, (char) => char.toUpperCase())
      .replace(/(à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ñ|ò|ó|ô|õ|ö|ø|ù|ú|û|ü|ý|ÿ)\w/g, (match) => match.toLowerCase())
  };


  //Esta função tem o propósito de inserir valores nos dados acima, que estão vázios.
  const handleChange = (e) => {
    const enderecoFields = ['tipo_endereco', 'num_cep', 'logradouro', 'nome_endereco', 'num_endereco', 'complemento', 'bairro', 'cidade', 'estado', 'pais'];
    const { name, value } = e.target;

    let formattedValue = formatValue(value);

    if (name === "id_secretaria") {
      const secretariaSelecionada = secretarias.find(sec => sec.id_secretaria === Number(value));

      setFormData({
        ...formData,
        secretaria: secretariaSelecionada || null,
        nome_secretaria: secretariaSelecionada ? secretariaSelecionada.nome_secretaria : "" // Atualiza o nome corretamente
      });
    } else if (enderecoFields.includes(name)) {
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

  const handleChangeNome = (nome_secretaria) => {
    if (/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/.test(nome_secretaria)) {
      const formattedNome = formatValue(nome_secretaria);
      setFormData({
        ...formData,
        nome_secretaria: formattedNome
      });
    }
  };


  //A função abaixo lida com a conexão com o backend e a requisição de cadastrar um municipe.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      console.log("Duplo Click detectado!")
      return; // Impede chamadas 
    }
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 1000); // Reativa após 1s

    console.log("Dados enviados:", formData); // Depuração

    try {
      const response = await axiosInstance.post('/protoon/municipe/endereco', {
        ...formData.endereco,
      });

      console.log("Resposta do endereço:", response.data); // Verifique se response.data tem id

      if (!response.data.id_endereco || isNaN(response.data.id_endereco)) {
        throw new Error("ID inválido retornado do servidor.");
      }

      const createSecretaria = await axiosInstance.post(`protoon/secretaria/${response.data.id_endereco}`, {
        nome_secretaria: formData.nome_secretaria,
        nome_responsavel: formData.nome_responsavel,
        email: formData.email
      });

      console.log("Resposta da Secretaria:", createSecretaria.data);

      setRemoveLoading(false);
      setTimeout(() => {
        setRemoveLoading(true);
        setMessage('Cadastro feito com Sucesso! Redirecionando...');
        setType('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }, 3000);
    } catch (error) {
      setRemoveLoading(false);
      setTimeout(() => {
        setRemoveLoading(true);
        console.error('Erro ao enviar os dados:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('Falha ao tentar fazer o Cadastro!');
        }
        setType('error');
      }, 3000);
    }
  };

  const sendToLogin = async () => {
    navigate("/login")
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Seção Dados da Secretaria */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <FaBuilding /> Dados da Secretaria
          </h3>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label><FaBuilding /> Secretaria:</label>
              <div className={styles.selectContainer}>
                <select
                  name="id_secretaria"
                  value={formData.secretaria ? formData.secretaria.id_secretaria : ''}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Selecione uma secretaria</option>
                  {secretarias.map(secretaria => (
                    <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                      {secretaria.nome_secretaria}
                    </option>
                  ))}
                </select>
                <span className={styles.selectIcon}></span>
              </div>
            </div>

            <div className={styles.inputField}>
              <label><FaUserTie /> Nome do Responsável:</label>
              <input
                type="text"
                name="nome_responsavel"
                value={formData.nome_responsavel}
                onChange={handleChange}
                required
                minLength={6}
              />
              <span className={styles.inputIcon}><FaUserTie /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaEnvelope /> Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Ex.: responsavel@secretaria.com"
                value={formData.email}
                onChange={handleChange}
                required
                minLength={7}
              />
              <span className={styles.inputIcon}><FaEnvelope /></span>
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
                placeholder="Bloco / Nº do Apartamento / Fundos..."
                value={formData.endereco.complemento}
                onChange={handleChange}
              />
              <span className={styles.inputIcon}><FaHome /></span>
            </div>

            <div className={styles.inputField}>
              <label><FaBuilding /> Tipo de Endereço:</label>
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
          {message && <Message type={type} msg={message} />}

          {removeLoading ? (
            <>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                <FaSignInAlt /> Cadastrar Secretaria
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={sendToLogin}
              >
                <FaArrowLeft /> Voltar
              </button>
            </>
          ) : (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          )}
        </div>
      </form>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Proto-on. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default GerenciarSecretaria;
