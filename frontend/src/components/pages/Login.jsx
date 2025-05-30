import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import Button from "../base/Button";
import Card from "../base/Card";
import Input from "../base/Input";
import Loader from "../base/Loader";
import Notification from "../base/Notification";

function Login({ updateAuthStatus }) {
	const [form, setForm] = useState({ username: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [notification, setNotification] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('role');
		sessionStorage.removeItem('username');
		sessionStorage.removeItem('photo');
		sessionStorage.removeItem('fullName');

		const tokenExists = sessionStorage.getItem("token") !== null;
		if (tokenExists) {
			navigate("/home");
		}
	}, [navigate]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setNotification("");

		// Permite "admin" ou e-mail válido
		const isAdminLogin = form.username === "admin";
		const isEmail = form.username.includes("@");

		if (!isAdminLogin && !isEmail) {
			setNotification("Informe um e-mail válido ou 'admin' para o administrador principal.");
			setLoading(false);
			return;
		}

		try {
			const response = await axiosInstance.post("http://localhost:3001/login", form);

			if (response.data.accessToken) {
				sessionStorage.setItem("token", response.data.accessToken);
				sessionStorage.setItem("role", response.data.role);
				sessionStorage.setItem("username", form.username);
				sessionStorage.setItem("photo", response.data.photo);
				sessionStorage.setItem("fullName", response.data.fullName);
				updateAuthStatus(true);
				navigate("/home");
			} else {
				setNotification("Usuário ou senha inválidos.");
			}
		} catch (error) {
			setNotification("Erro ao fazer login. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">E-mail ou admin:</label>
				<Input
					id="username"
					name="username"
					type="text"
					value={form.username}
					onChange={handleChange}
					required
				/>
				<label htmlFor="password">Senha:</label>
				<Input
					id="password"
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
					required
				/>
				<Button type="submit" disabled={loading}>
					{loading ? <Loader /> : "Entrar"}
				</Button>
			</form>
			{notification && <Notification>{notification}</Notification>}
		</Card>
	);
}

export default Login;
