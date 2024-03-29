import axios from "axios";
import bcrypt from 'bcryptjs';

const updateUser = async (username, formData) => {
  try {
    const hashedPassword = bcrypt.hashSync(formData.password, 10);
    console.log(username)
    const response = await axios.put(`http://localhost:8080/users/${username}`, {
      username: formData.username,
      password: hashedPassword
    });
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
    throw error;
  }
};

export default updateUser;
