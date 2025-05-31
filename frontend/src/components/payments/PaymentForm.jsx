import React, { useState } from "react";
import Input from "../base/Input";
import Button from "../base/Button";
import Card from "../base/Card";
import Loader from "../base/Loader";
import Notification from "../base/Notification";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

function PaymentForm() {
  const [form, setForm] = useState({ tripId: "", amount: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const validate = () => {
    const newErrors = {};
    if (!form.tripId) newErrors.tripId = "ID da viagem obrigatório";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      newErrors.amount = "Valor deve ser maior que zero";
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
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        "http://localhost:3001/payments",
        { ...form, amount: Number(form.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Pagamento criado com sucesso.");
      navigate("/payments");
    } catch (error) {
      showNotification("Erro ao criar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <Card>
      <h2>Novo Pagamento</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="tripId">ID da Viagem:</label>
        <Input
          id="tripId"
          name="tripId"
          value={form.tripId}
          onChange={handleChange}
        />
        {errors.tripId && (
          <span style={{ color: "red" }}>{errors.tripId}</span>
        )}

        <label htmlFor="amount">Valor:</label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
        />
        {errors.amount && (
          <span style={{ color: "red" }}>{errors.amount}</span>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Criar"}
        </Button>
      </form>
      <Notification />
    </Card>
  );
}

export default PaymentForm;