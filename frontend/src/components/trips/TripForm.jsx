import React, { useState } from "react";
import Button from "../base/Button";
import Card from "../base/Card";
import Loader from "../base/Loader";
import Notification from "../base/Notification";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import Input from "../base/Input"; // Certifique-se de que o caminho para o componente Input esteja correto

function TripForm() {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [form, setForm] = useState({ campo: "" }); // Estado para os campos do formulário
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        "http://localhost:3001/trips",
        { ...form }, // Envie os dados do formulário na requisição
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification("Viagem criada com sucesso.");
      setTimeout(() => navigate("/trips"), 1200);
    } catch (error) {
      setNotification("Erro ao criar viagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Criar Viagem</h2>
      <form onSubmit={handleSubmit}>
        <Input name="campo" value={form.campo} onChange={handleChange} />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Criar"}
        </Button>
      </form>
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default TripForm;