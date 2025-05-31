import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Card from "../base/Card";
import Button from "../base/Button";
import Loader from "../base/Loader";
import Notification from "../base/Notification";
import { useParams } from "react-router-dom";
import Input from "../base/Input"; // Certifique-se de que o caminho para o componente Input está correto
import { useNotification } from "../../context/NotificationContext";

function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState(""); // Estado para o ID do estudante a ser adicionado
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line
  }, [id]);

  const fetchTrip = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axiosInstance.get(
        `http://localhost:3001/trips/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTrip(response.data);
      setStudents(response.data.students || []);
    } catch (error) {
      showNotification("Erro ao carregar detalhes da viagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = async () => {
    if (!window.confirm("Finalizar esta viagem?")) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        `http://localhost:3001/trips/${id}/end`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Viagem finalizada.");
      fetchTrip();
    } catch (error) {
      showNotification("Erro ao finalizar viagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPresence = async (studentId) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        `http://localhost:3001/students/${studentId}/mark-presence`,
        { tripId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Presença marcada.");
      fetchTrip();
    } catch (error) {
      showNotification("Erro ao marcar presença.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axiosInstance.post(
        `http://localhost:3001/trips/${id}/students`,
        { studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Estudante adicionado.");
      setStudentId("");
      fetchTrip();
    } catch (error) {
      showNotification("Erro ao adicionar estudante.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2>Detalhes da Viagem</h2>
      {loading ? (
        <Loader />
      ) : trip ? (
        <>
          <p>ID: {trip.id}</p>
          <p>Condutor: {trip.driverId}</p>
          <p>Início: {new Date(trip.startTime).toLocaleString()}</p>
          <p>Status: {trip.status}</p>
          <Button onClick={handleEndTrip} disabled={trip?.status === "completed"}>
            Finalizar Viagem
          </Button>
          <h3>Estudantes</h3>
          <ul>
            {students.length === 0 ? (
              <li>Nenhum estudante nesta viagem.</li>
            ) : (
              students.map((s) => (
                <li key={s.id}>
                  {s.fullName}
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => handleMarkPresence(s.id)}
                  >
                    Marcar Presença
                  </Button>
                </li>
              ))
            )}
          </ul>
          <form onSubmit={handleAddStudent} style={{ marginTop: 16 }}>
            <Input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="ID do estudante"
              required
            />
            <Button type="submit">Adicionar Estudante</Button>
          </form>
        </>
      ) : (
        <p>Viagem não encontrada.</p>
      )}
      <Notification />
    </Card>
  );
}

export default TripDetails;