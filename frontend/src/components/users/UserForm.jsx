import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../base/Button";
import Card from "../base/Card";
import Input from "../base/Input";
import Loader from "../base/Loader";
import Notification from "../base/Notification";

function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "common",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchUser();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.get(
        `http://localhost:3001/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({
        fullName: response.data.fullName,
        username: response.data.username,
        password: "",
        role: response.data.role,
      });
    } catch (error) {
      setNotification("Erro ao carregar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Nome obrigatório";
    if (!form.username || !form.username.includes("@"))
      newErrors.username = "E-mail válido obrigatório";
    if (!form.password && !isEdit) newErrors.password = "Senha obrigatória";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setNotification("");
    try {
      const token = sessionStorage.getItem("token");
      if (isEdit) {
        await axiosInstance.put(
          `http://localhost:3001/users/${id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotification("Usuário atualizado com sucesso.");
      } else {
        await axiosInstance.post(
          "http://localhost:3001/users",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotification("Usuário criado com sucesso.");
      }
      setTimeout(() => navigate("/users"), 1200);
    } catch (error) {
      setNotification("Erro ao salvar usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>{isEdit ? "Editar Usuário" : "Novo Usuário"}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullName">Nome completo:</label>
        <Input
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
        {errors.fullName && (
          <span style={{ color: "red" }}>{errors.fullName}</span>
        )}

        <label htmlFor="username">E-mail:</label>
        <Input
          id="username"
          name="username"
          type="email"
          value={form.username}
          onChange={handleChange}
          disabled={isEdit}
        />
        {errors.username && (
          <span style={{ color: "red" }}>{errors.username}</span>
        )}

        <label htmlFor="password">Senha:</label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required={!isEdit}
        />
        {errors.password && (
          <span style={{ color: "red" }}>{errors.password}</span>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : isEdit ? "Salvar" : "Criar"}
        </Button>
      </form>
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default UserForm;