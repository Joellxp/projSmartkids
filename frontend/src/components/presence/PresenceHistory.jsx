import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Card from "../base/Card";
import Loader from "../base/Loader";
import Notification from "../base/Notification";

function PresenceHistory({ studentId: propStudentId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const role = sessionStorage.getItem("role");
  const userId = sessionStorage.getItem("userId");

  // Se for responsável, pode passar o studentId como prop; se comum, usa o próprio userId
  const studentId = propStudentId || userId;

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [studentId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const url = `http://localhost:3001/presence/history/${studentId}`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(response.data.history || []);
    } catch (error) {
      setNotification("Erro ao carregar histórico de presença.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Histórico de Presença</h2>
      {loading ? (
        <Loader />
      ) : history.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 400,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Viagem</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.tripId}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.present ? "Presente" : "Faltou"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default PresenceHistory;