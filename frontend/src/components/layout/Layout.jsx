// filepath: src/components/layout/Layout.jsx
import React, { useState } from "react";

const Layout = ({ sidebar, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f8faf5" }}>
      {/* Botão de menu fixo */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 1001,
          background: "#6aa839",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 48,
          height: 48,
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          display: "block",
        }}
        aria-label="Abrir menu"
      >
        ☰
      </button>
      {/* Sidebar retrátil */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : -260,
          width: 240,
          height: "100vh",
          background: "#fff",
          boxShadow: sidebarOpen ? "2px 0 16px rgba(0,0,0,0.08)" : "none",
          zIndex: 1000,
          padding: 24,
          overflowY: "auto",
          transition: "left 0.3s",
        }}
      >
        {sidebar}
      </div>
      {/* Conteúdo principal */}
      <main
        style={{
          marginLeft: 0,
          width: "100%",
          minHeight: "100vh",
          padding: "48px 5vw 32px 5vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
          transition: "margin-left 0.3s",
        }}
      >
        {children}
      </main>
      {/* Responsividade: esconde sidebar no mobile */}
      <style>
        {`
          @media (max-width: 700px) {
            main {
              padding: 24px 2vw 16px 2vw !important;
              max-width: 100vw !important;
            }
            button[aria-label="Abrir menu"] {
              top: 12px !important;
              left: 12px !important;
              width: 40px !important;
              height: 40px !important;
              font-size: 22px !important;
            }
            div[style*="position: fixed"][style*="width: 240px"] {
              width: 80vw !important;
              min-width: 180px !important;
              padding: 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Layout;