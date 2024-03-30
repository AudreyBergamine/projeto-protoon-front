import React, { useState, useEffect } from "react";
import axios from "axios";

function UsersList() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar os usuários:", error);
        }
    };    

    return (
        <div>
            <h1>Lista de Usuários</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
}

export default UsersList;
