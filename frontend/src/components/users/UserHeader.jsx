import React from "react";
import Card from "../base/Card";

function UserHeader() {
  const fullName = sessionStorage.getItem("fullName") || "";
  const role = sessionStorage.getItem("role") || "";
  const photo = sessionStorage.getItem("photo") || "";

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "condutor":
        return "Condutor";
      case "responsavel":
        return "Responsável";
      case "common":
        return "Usuário Comum";
      default:
        return "";
    }
  };

  return (
    <Card style={{ display: "flex", alignItems: "center" }}>
      {photo && (
        <img
          src={photo}
          alt="Foto do usuário"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #6aa839",
          }}
        />
      )}
      <span>{fullName}</span>
    </Card>
  );
}

export default UserHeader;