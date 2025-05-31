import React from "react";
import Card from "../base/Card";

function UserHeader() {
  const fullName = sessionStorage.getItem("fullName") || "";
  const photo = sessionStorage.getItem("photo") || "";

  return (
    <Card style={{ display: "flex", alignItems: "center" }}>
      <img
        src={photo ? `/uploads/${photo}` : "/default-avatar.png"}
        alt="Foto do usuário"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #6aa839",
        }}
      />
      <span>{fullName}</span>
      <button
        onClick={() => {
          sessionStorage.clear();
          window.location.href = "/login";
        }}
      >
        Sair
      </button>
    </Card>
  );
}

export default UserHeader;