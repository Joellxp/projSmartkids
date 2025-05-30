import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Card from "../base/Card";
import Loader from "../base/Loader";
import Notification from "../base/Notification";

function Reports() {
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchTotals();
    // eslint-disable-next-line
  }, []);

  const fetchTotals = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.get(
        "http://localhost:3001/reports/totals",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotals(response.data);
    } catch (error) {
      setNotification("Erro ao carregar relatório.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Relatórios</h2>
      {loading ? (
        <Loader />
      ) : totals ? (
        <ul>
          <li>
            <strong>Total de Usuários:</strong> {totals.users}
          </li>
          <li>
            <strong>Total de Viagens:</strong> {totals.trips}
          </li>
          <li>
            <strong>Total de Pagamentos:</strong> {totals.payments}
          </li>
          <li>
            <strong>Total de Arquivos:</strong> {totals.files}
          </li>
        </ul>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default Reports;