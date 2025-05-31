import { useNotification } from "../../context/NotificationContext";

export default function Notification() {
  const { message, clearNotification } = useNotification();
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: "#333",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 8,
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {message}
      <button
        onClick={clearNotification}
        style={{
          marginLeft: 16,
          background: "none",
          color: "#fff",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}