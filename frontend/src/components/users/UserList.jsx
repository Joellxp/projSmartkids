import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { Link } from "react-router-dom";
import Button from "../base/Button";
import Card from "../base/Card";
import Loader from "../base/Loader";
import Notification from "../base/Notification";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchUsers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.get(
        `http://localhost:3001/users?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.users);
      setPages(response.data.pages);
    } catch (error) {
      setNotification("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.delete(`http://localhost:3001/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification("Usuário deletado com sucesso.");
      fetchUsers(page);
    } catch (error) {
      setNotification("Erro ao deletar usuário. Tente novamente.");
    }
  };

  const handleAdd = () => {
    // Lógica para adicionar um novo usuário
  };

  const handleEdit = (userId) => {
    // Lógica para editar um usuário existente
  };

  return (
    <Card>
      <h2>Usuários</h2>
      <Button onClick={handleAdd}>Novo Usuário</Button>
      {loading ? (
        <Loader />
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Papel</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button onClick={() => handleEdit(user.id)}>Editar</Button>
                    <Button
                      style={{ background: "#9d714b", marginLeft: 8 }}
                      onClick={() => handleDelete(user.id)}
                    >
                      Deletar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* Paginação */}
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        {Array.from({ length: pages }, (_, i) => (
          <Button
            key={i + 1}
            style={{
              background: page === i + 1 ? "#6aa839" : "#9d714b",
              margin: "0 4px",
            }}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default UserList;