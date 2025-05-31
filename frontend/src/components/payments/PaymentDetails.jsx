import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Card from "../base/Card";
import Button from "../base/Button";
import Loader from "../base/Loader";
import Notification from "../base/Notification";
import { useParams } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

function PaymentDetails() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification, notification } = useNotification();
  // const navigate = useNavigate();

  useEffect(() => {
    fetchPayment();
    // eslint-disable-next-line
  }, [id]);

  const fetchPayment = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.get(
        `http://localhost:3001/payments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayment(response.data);
    } catch (error) {
      showNotification("Erro ao carregar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        `http://localhost:3001/payments/${id}/mark-as-paid`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Pagamento marcado como pago.");
    } catch (error) {
      showNotification("Erro ao atualizar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Detalhes do Pagamento</h2>
      {loading ? (
        <Loader />
      ) : payment ? (
        <>
          <p>ID: {payment.id}</p>
          <p>Usuário: {payment.userId}</p>
          <p>Viagem: {payment.tripId}</p>
          <p>Valor: R$ {payment.amount}</p>
          <p>Status: {payment.status}</p>
          <p>
            Data:{" "}
            {payment.paymentDate
              ? new Date(payment.paymentDate).toLocaleDateString()
              : "-"}
          </p>
          <Button onClick={handleMarkAsPaid} disabled={payment?.status === "paid"}>
            Marcar como Pago
          </Button>
        </>
      ) : (
        <p>Pagamento não encontrado.</p>
      )}
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default PaymentDetails;