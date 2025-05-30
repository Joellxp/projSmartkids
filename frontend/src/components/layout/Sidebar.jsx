import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../base/Button";

function Sidebar() {
	const navigate = useNavigate();
	const role = sessionStorage.getItem("role");

	return (
		<nav>
			<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/home")}>
				Início
			</Button>
			{role === "admin" && (
				<>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/users")}>
						Usuários
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/trips")}>
						Viagens
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/payments")}>
						Pagamentos
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/files")}>
						Arquivos
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/reports")}>
						Relatórios
					</Button>
				</>
			)}
			{role === "condutor" && (
				<>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/trips")}>
						Minhas Viagens
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/files")}>
						Arquivos
					</Button>
				</>
			)}
			{role === "responsavel" && (
				<>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/presence")}>
						Presença
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/payments")}>
						Pagamentos
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/files")}>
						Arquivos
					</Button>
				</>
			)}
			{role === "common" && (
				<>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/presence")}>
						Presença
					</Button>
					<Button style={{ width: "100%", marginBottom: 12 }} onClick={() => navigate("/payments")}>
						Pagamentos
					</Button>
				</>
			)}
			<Button
				style={{ width: "100%", marginTop: 24, background: "#6aa839" }}
				onClick={() => {
					sessionStorage.clear();
					navigate("/login");
				}}
			>
				Sair
			</Button>
		</nav>
	);
}

export default Sidebar;