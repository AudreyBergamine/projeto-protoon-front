import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import SetCelular from "../services/setCelular";
import SetCPF from "../services/setCPF";
import SetCEP from "../services/setCEP";
import Loading from '../layouts/Loading';
import Message from '../layouts/Message'
import URL from '../services/url';

//Função de cadastro de municipe
function CadastrarFuncionario() {
  const [message, setMessage] = useState()
  const [cpfValid, setCpfValid] = useState(false);
  const [endereco, setEndereco] = useState();
  const [alert, setAlert] = useState('');
  const [type, setType] = useState()
  const navigate = useNavigate();
  const [removeLoading, setRemoveLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axiosInstance = axios.create({
    baseURL: URL, // Adjust the base URL as needed
    withCredentials: true, // Set withCredentials to true
  });

  // Recuperar o token do localStorage
  const token = localStorage.getItem('token');

  // Adicionar o token ao cabeçalho de autorização
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  //Este campo abaixo é um objeto em json que é enviado ao backend para requisitar o cadastro!
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    num_CPF: "",
    celular: "",
    data_nascimento: "",
    role: "",
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
  const roles = ["Coordenador", "Funcionario"]
  const [secretarias, setSecretarias] = useState([]);
  const [idSecretariaSelecionada, setIdSecretariaSelecionada] = useState("");
  // Estado para controlar o tipo de funcionário selecionado

  // Estado para controlar a secretaria selecionada


  useEffect(() => {
    async function fetchSecretarias() {
      try {
        const response = await axiosInstance.get('/protoon/secretaria');
        setSecretarias(response.data);
      } catch (error) {
        console.error('Erro ao buscar as secretarias:', error);
      }
    }
    fetchSecretarias();
  }, []);


  const handleAlertChange = (newAlert) => {
    setAlert(newAlert);
  };



  const handleCpfValidChange = (isCpfValid) => {
    setCpfValid(isCpfValid);
  };

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
    //A lista abaixo contém o nome de todos os campos que há em endereço
    const enderecoFields = ['tipo_endereco', 'num_cep', 'logradouro', 'nome_endereco', 'num_endereco', 'complemento', 'bairro', 'cidade', 'estado', 'pais'];

    const { name, value } = e.target;

    let formattedValue = formatValue(value);



    if (enderecoFields.includes(name)) {//Caso em um formulário contenha algum nome da lista, então será alterado o valor do objeto endereco
      setFormData({
        ...formData,
        endereco: {
          ...formData.endereco,
          [name]: formattedValue
        }
      });

    } else {//Caso não, será atualizado o campo municipe (todos os outros campos).
      if (name === 'email') {
        setFormData({
          ...formData,
          [name]: value.toLowerCase() // Formata o email para minúsculas
        })
      } else {
        setFormData({
          ...formData,
          [name]: formattedValue
        });
      }
    };
  }
  const handleSecretariaChange = (e) => {
    const selectedSecretariaId = e.target.value;
    setIdSecretariaSelecionada(selectedSecretariaId);
  };
  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

  const handleChangeNome = (nome) => {
    if (/^[a-zA-Z\s]*$/.test(nome)) {
      const formattedNome = formatValue(nome);
      setFormData({
        ...formData,
        nome: formattedNome
      });
    }
  };

  //A função abaixo lida com a conexão com o backend e a requisição de cadastrar um municipe.
  const handleSubmit = async (e) => {
    if (isSubmitting) {
      console.log("Duplo Click detectado!")
      return; // Impede chamadas 
    }
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 1000); // Reativa após 1s
    e.preventDefault();
    if (!cpfValid) {
      setMessage('Cpf Inválido')
      return
    }

    setMessage('')

    if (formData.role === "") {
      setMessage('Selecione o tipo de funcionário');
      setType('error')
      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }
    // Verifica se a data de nascimento é menos de 5 anos da data atual
    const birthDate = moment(formData.data_nascimento);
    const currentDate = moment();
    const diffYears = currentDate.diff(birthDate, 'years');
    if (diffYears < 5) {
      setMessage('Idade minima requirida é de 5 anos');
      setType('error');
      return;
    }

    try {
      const formattedDate = moment(formData.data_nascimento).format('YYYY-MM-DD');
      const response = await axiosInstance.post('protoon/auth/register/funcionario/' + idSecretariaSelecionada, {
        ...formData, // Inclua todos os dados do formData
        role: formData.role.toUpperCase(),
        data_nascimento: formattedDate, // Substitua o campo data_nascimento formatado

      });

      setRemoveLoading(false)

      setTimeout(() => {
        console.log(response.data);
        setRemoveLoading(true)
        setMessage('Cadastro feito com Sucesso! Redirecionando...')
        setType('success')
        setTimeout(() => {
          navigate('/login');
        }, 3000)
      }, 3000)
    } catch (error) {
      setRemoveLoading(false)
      setTimeout(() => {
        setRemoveLoading(true)
        console.error('Erro ao enviar os dados:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message); // Exibir a mensagem de erro do servidor
        } else {
          setMessage('Falha ao tentar fazer o Cadastro!'); // Se não houver mensagem de erro específica, exibir uma mensagem genérica
        }
        setType('error')
      }, 3000)
    }
  }

  const sendToLogin = async () => {
    navigate("/login")
  }

  //Por fim é retornado o html para ser exibido no front end, junto com as funções acima.
  return (

    <form onSubmit={handleSubmit}>
      <div style={{ paddingBottom: '100px' }}>

        <h3 style={{ marginTop: 70 }}>Dados Pessoais</h3>
        <div className="register-form">
          <div className="input-container">

            <div>
              <label>Nome:</label><br></br>
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

            <div>
              <label>Email:</label><br></br>
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

            <div>
              <label>Senha:</label><br></br>
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

          <div className="input-container">
            <div>
              <label>Número do CPF:</label><br></br>
              <SetCPF
                cpfValido={handleCpfValidChange}
                onCPFChange={(formattedCPF) => {
                  setFormData({ ...formData, num_CPF: formattedCPF })
                }}
              />
            </div>

            <div>
              <label>Celular:</label><br></br>
              <SetCelular onCelularChange={(formattedCelular) => {
                setFormData({ ...formData, celular: formattedCelular })
              }}
              />
            </div>

            <div>
              <label>Data de Nascimento:</label><br></br>
              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Tipo Funcionário:</label><br />
              <select
                style={{ fontSize: 11, padding: 10, borderRadius: 10, textAlign: "center" }}
                name="role"
                value={formData.role} // Alterado de selectedRole para formData.role
                onChange={handleRoleChange} // Mantido o mesmo handler
              >
                <option value="">Selecione um tipo de funcionário</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Select para a secretaria */}
            <div>
              <label>Secretaria:</label><br />
              <select
                style={{ fontSize: 11, padding: 10, borderRadius: 10, textAlign: "center" }}
                value={idSecretariaSelecionada} // Aqui se precisa usar idSecretariaSelecionada em vez de selectedSecretaria
                onChange={handleSecretariaChange}
              >
                <option value="">Selecione a secretaria que o funcionário trabalhará</option>
                {secretarias.map(secretaria => (
                  <option key={secretaria.id_secretaria} value={secretaria.id_secretaria}>
                    {secretaria.nome_secretaria}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
        <hr></hr>
        <h3>Endereço</h3>
        <div className="register-form">
          <div className="input-container">

            <div>
              <label>Número do CEP:</label><br></br>
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
              <label>Endereço:</label><br></br>
              <input
                type="text"
                name="logradouro"
                placeholder="Ex.: Rua das Flores"
                value={formData.endereco.logradouro}
                onChange={handleChange}
                required
                readOnly={alert === '' ? true : false}
                className={alert === '' ? 'readonly-bg' : ""}
              />
            </div>

            <div>
              <label>Número:</label><br></br>
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
              <label>Complemento:</label><br></br>
              <input
                type="text"
                name="complemento"
                placeholder="Bloco, apartamento, casa, fundos..."
                value={formData.endereco.complemento}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        <div className="register-form">
          <div className="input-container">

            <div>
              <label>Tipo de Endereço:</label><br></br>
              <input
                type="text"
                name="tipo_endereco"
                placeholder="Ex.: casa, apartamento"
                value={formData.endereco.tipo_endereco}
                onChange={handleChange}
                minLength={3}
                required
              />
            </div>

            <div>
              <label>Bairro:</label><br></br>
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
              <label>Cidade:</label><br></br>
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
              <label>Estado:</label><br></br>
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
              <label>País:</label><br></br>
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
        <div style={{ marginTop: 50 }}>
          {message && <Message type={type} msg={message} />}
          {!removeLoading && <Loading />}
          {removeLoading && <div style={{ marginTop: -30 }}>
            <button type="submit" className="btn-cad" style={{ marginRight: '100px' }}>Cadastrar-se</button>
            <button className="btn-log" onClick={sendToLogin}>Voltar</button>
          </div>}
        </div>
      </div>
    </form>
  );
}
export default CadastrarFuncionario