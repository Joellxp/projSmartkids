import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Card from "../base/Card";
import Button from "../base/Button";
import Loader from "../base/Loader";
import Notification from "../base/Notification";
// import { Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

function TripsList({ onSelectTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification, notification } = useNotification();

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const role = sessionStorage.getItem("role");
      let url = "http://localhost:3001/trips";
      if (role === "condutor") url = "http://localhost:3001/trips/me";
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips(response.data.trips || []);
    } catch (error) {
      showNotification("Erro ao carregar viagens.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    // Lógica para criar uma nova viagem
  };

  const handleDetails = (id) => {
    // Lógica para exibir os detalhes da viagem
  };

  return (
    <Card>
      <h2>Viagens</h2>
      <Button onClick={handleCreate}>Criar Viagem</Button>
      {loading ? (
        <Loader />
      ) : (
        <ul>
          {trips.length === 0 ? (
            <li>Nenhuma viagem encontrada.</li>
          ) : (
            trips.map((trip) => (
              <li key={trip.id}>
                {trip.info}
                <Button style={{ marginLeft: 8 }} onClick={() => handleDetails(trip.id)}>Detalhes</Button>
              </li>
            ))
          )}
        </ul>
      )}
      {notification && <Notification>{notification}</Notification>}
    </Card>
  );
}

export default TripsList;