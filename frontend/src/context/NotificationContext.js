import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState("");

  const showNotification = (msg) => setMessage(msg);
  const clearNotification = () => setMessage("");

  return (
    <NotificationContext.Provider value={{ message, showNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}