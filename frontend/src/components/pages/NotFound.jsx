import React from "react";
import Card from "../base/Card";
import Button from "../base/Button";
import { useNavigate } from "react-router-dom";

function NotFound() {
	const navigate = useNavigate();

	return (
		<Card>
			<h2>Página não encontrada</h2>
			<Button onClick={() => navigate("/home")}>Voltar</Button>
		</Card>
	);
}

export default NotFound;
