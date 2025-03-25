import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SetCEP from "../services/setCEP";
import Loading from '../layouts/Loading';
import Message from '../layouts/Message'
import URL from '../services/url';

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
      // Encontra a secretaria correspondente ao ID selecionado
      const secretariaSelecionada = secretarias.find(sec => sec.id_secretaria === parseInt(value));

      setFormData({
        ...formData,
        secretaria: secretariaSelecionada || null // Atualiza o objeto secretaria corretamente
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

  //Por fim é retornado o html para ser exibido no front end, junto com as funções acima.
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ paddingBottom: '100px' }}>
        <h3>Dados da Secretaria</h3>
        <div className="register-form">
          <div className="input-container">
            <div>
              <select
                name="id_secretaria"
                value={formData.secretaria ? formData.secretaria.id_secretaria : ''}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma secretaria</option>
                {secretarias.map(secretaria => (
                  <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                    {secretaria.nome_secretaria}
                  </option>
                ))}
              </select>

              <label style={{ textAlign: 'center' }}>Nome:</label><br></br>
              {/* <input
                type="text"
                name="nome_secretaria"
                placeholder="Ex.: Secretaria de Meio Ambiente"
                value={formData.nome_secretaria}
                onChange={handleChange}
                required
                minLength={3}
              /> */}
            </div>

            <div>
              <label style={{ textAlign: 'center' }}>Nome do Responsável:</label><br></br>
              <input
                type="text"
                name="nome_responsavel"
                value={formData.nome_responsavel}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label style={{ textAlign: 'center' }}>Email:</label><br></br>
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

          </div>
        </div>
        <hr></hr>
        <h3>Endereço</h3>
        <div className="register-form">
          <div className="input-container">

            <div>
              <label style={{ textAlign: 'center' }}>Número do CEP:</label><br></br>
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

            <div>
              <label style={{ textAlign: 'center' }}>Endereço:</label><br></br>
              <input
                type="text"
                name="logradouro"
                placeholder="Ex.: Rua 23 de Maio"
                value={formData.endereco.logradouro}
                onChange={handleChange}
                required
                readOnly={alert === '' ? true : false}
                className={alert === '' ? 'readonly-bg' : ""}
              />
            </div>
            {/* <div> */}
            {/* TODO: Ocultar esse trecho para o usuário e deixar nullable */}
            {/* <label style={{ textAlign: 'center' }}>Nome Endereço:</label><br></br> 
              <input
                type="text"
                name="nome_endereco"
                placeholder="Ex.: Marechael Teodoro"
                value={formData.endereco.nome_endereco}
                onChange={handleChange}
                required
                minLength={3}
              /> */}
            {/* </div> */}
            <div>
              <label style={{ textAlign: 'center' }}>Número:</label><br></br>
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
            <div>
              <label style={{ textAlign: 'center' }}>Complemento:</label><br></br>
              <input
                type="text"
                name="complemento"
                placeholder="Bloco / Nº do Apartamento / Fundos..."
                value={formData.endereco.complemento}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="register-form">
          <div className="input-container">
            <div>
              <label style={{ textAlign: 'center' }}>Tipo de Endereço:</label><br></br>
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

            <div>
              <label style={{ textAlign: 'center' }}>Bairro:</label><br></br>
              <input
                type="text"
                name="bairro"
                placeholder="Ex.: Bairro das Flores"
                value={formData.endereco.bairro}
                onChange={handleChange}
                required
                minLength={2}
                readOnly={alert === '' ? true : false}
                className={alert === '' ? 'readonly-bg' : ""}
              />
            </div>

            <div>
              <label style={{ textAlign: 'center' }}>Cidade:</label><br></br>
              <input
                type="text"
                name="cidade"
                placeholder="Ex.: Ferraz de Vasconcelos"
                value={formData.endereco.cidade}
                onChange={handleChange}
                required
                minLength={2}
                readOnly={alert === '' ? true : false}
                className={alert === '' ? 'readonly-bg' : ""}
              />
            </div>

            <div>
              <label style={{ textAlign: 'center' }}>Estado:</label><br></br>
              <input
                type="text"
                name="estado"
                placeholder="Ex.: São Paulo"
                value={formData.endereco.estado}
                onChange={handleChange}
                required
                minLength={2}
                readOnly={alert === '' ? true : false}
                className={alert === '' ? 'readonly-bg' : ""}
              />
            </div>

            <div>
              <label style={{ textAlign: 'center' }}>País:</label><br></br>
              <input
                type="text"
                name="pais"
                placeholder="Ex.: Brasil"
                value={formData.endereco.pais ? formData.endereco.pais : ""}
                readOnly={alert === '' ? true : false}
                className={alert === '' ? 'readonly-bg' : ""}
                onChange={(e) => handleChangePais(e.target.value)}
                required
                minLength={3}
              />
            </div>
          </div>
        </div>
        {message && <Message type={type} msg={message} />}
        {!removeLoading && <Loading />}
        {removeLoading && <div style={{ marginTop: -30 }}>
          <button type="submit" className="btn-cad" style={{ marginRight: '100px' }}>Cadastrar-se</button>
          <button className="btn-log" onClick={sendToLogin}>Voltar</button>
        </div>}
      </div>
      <footer className="footer">
        © 2024 Proto-on. Todos os direitos reservados.
      </footer>
    </form>
  );
}

export default GerenciarSecretaria;
