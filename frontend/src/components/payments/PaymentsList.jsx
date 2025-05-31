import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Card from "../base/Card";
import Button from "../base/Button";
import Loader from "../base/Loader";
import Notification from "../base/Notification";
// import { Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification, notification } = useNotification();
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");
  

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      let url = "http://localhost:3001/payments";
      if (role !== "admin") {
        url = `http://localhost:3001/payments/user/${userId}`;
      }
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data.payments || response.data || []);
    } catch (error) {
      showNotification("Erro ao carregar pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    // Lógica para criar um novo pagamento
  };

  const handleMarkAsPaid = async (paymentId) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.patch(
        `http://localhost:3001/payments/${paymentId}`,
        { status: "paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Pagamento marcado como pago.");
      fetchPayments();
    } catch (error) {
      showNotification("Erro ao atualizar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Pagamentos</h2>
      {(role === "responsavel" || role === "common") && (
        <Button onClick={handleNew}>Novo Pagamento</Button>
      )}
      {loading ? (
        <Loader />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 600,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Viagem</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
                {role === "admin" && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={role === "admin" ? 7 : 6}
                    style={{ textAlign: "center" }}
                  >
                    Nenhum pagamento encontrado.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.userId}</td>
                    <td>{p.tripId}</td>
                    <td>R$ {p.amount}</td>
                    <td>{p.status}</td>
                    <td>
                      {p.paymentDate
                        ? new Date(p.paymentDate).toLocaleDateString()
                        : "-"}
                    </td>
                    {role === "admin" && (
                      <td>
                        {p.status !== "paid" && (
                          <Button onClick={() => handleMarkAsPaid(p.id)}>
                            Marcar como Pago
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default PaymentsList;