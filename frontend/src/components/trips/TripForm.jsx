import React, { useState } from "react";
import Button from "../base/Button";
import Card from "../base/Card";
import Loader from "../base/Loader";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import Input from "../base/Input"; // Certifique-se de que o caminho para o componente Input esteja correto
import { useNotification } from "../../context/NotificationContext";

function TripForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ campo: "" }); // Estado para os campos do formulário
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        "http://localhost:3001/trips",
        { ...form }, // Envie os dados do formulário na requisição
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Viagem criada com sucesso.");
      navigate("/trips");
    } catch (error) {
      showNotification("Erro ao criar viagem.");
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
    </Card>
  );
}

export default TripForm;