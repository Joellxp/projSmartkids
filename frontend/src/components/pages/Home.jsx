import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Card from "../base/Card";
import Button from "../base/Button";

function Home() {
	const [users, setUsers] = useState([]);
	const [notification, setNotification] = useState("");
	const token = sessionStorage.getItem("token");
	const fullName = sessionStorage.getItem("fullName") || "";
	const role = sessionStorage.getItem("role") || "";
	const photo = sessionStorage.getItem("photo") || "";

	useEffect(() => {
		// Não precisa mais checar token aqui!
		axiosInstance.get("http://localhost:3001/users", {
			headers: { Authorization: `Bearer ${token}` }
		})
		.then(response => {
			setUsers(response.data);
		})
		.catch(error => {
			console.error("Erro ao carregar usuários:", error);
			setNotification("Token inválido ou expirado.");
		});
	}, [token]);

	// Exemplo de saudação e resumo dinâmico por papel
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
		<Card style={{ marginTop: 40 }}>
			<h1 style={{ textAlign: "center", color: "#6aa839", fontSize: 36, marginBottom: 8 }}>
				Bem-vindo, {fullName}!
			</h1>
			<p style={{ textAlign: "center", fontSize: 20, marginBottom: 32 }}>
				Seu papel: <strong>{getRoleLabel(role)}</strong>
			</p>
			{/* Aqui você pode adicionar cards/resumos dinâmicos por papel */}
			{/* Exemplo: */}
			{role === "admin" && (
				<div style={{ marginTop: "32px" }}>
					<h3>Resumo do sistema</h3>
					<ul>
						<li>Visualize e gerencie usuários, viagens e pagamentos.</li>
						<li>Acesse relatórios e arquivos do sistema.</li>
					</ul>
				</div>
			)}
			{role === "condutor" && (
				<div style={{ marginTop: "32px" }}>
					<h3>Suas viagens</h3>
					<ul>
						<li>Crie, finalize e gerencie suas viagens.</li>
						<li>Adicione estudantes e marque presença.</li>
					</ul>
				</div>
			)}
			{role === "responsavel" && (
				<div style={{ marginTop: "32px" }}>
					<h3>Seus estudantes</h3>
					<ul>
						<li>Visualize viagens e histórico de presença dos estudantes.</li>
						<li>Realize pagamentos escolares.</li>
					</ul>
				</div>
			)}
			{role === "common" && (
				<div style={{ marginTop: "32px" }}>
					<h3>Sua participação</h3>
					<ul>
						<li>Veja suas viagens e histórico de presença.</li>
						<li>Realize pagamentos escolares.</li>
					</ul>
				</div>
			)}
			<Button onClick={() => {
    sessionStorage.clear();
    window.location.href = "/";
}}>
    Sair
</Button>
		</Card>
	);
}

export default Home;