import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Link
} from "@mui/material";

export default function Login({ updateAuthStatus }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    celular: "",
    telefone: "",
    senha: "",
    confirmarSenha: ""
  });
  const [registerNotification, setRegisterNotification] = useState("");
  const [forgotForm, setForgotForm] = useState({ email: "" });
  const [forgotNotification, setForgotNotification] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    if (sessionStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    const msg = sessionStorage.getItem("logoutMsg");
    if (msg) {
      setNotification(msg);
      sessionStorage.removeItem("logoutMsg");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

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

  // Cadastro simulado
  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Simulação de cadastro
    if (
      !registerForm.nome ||
      !registerForm.sobrenome ||
      !registerForm.email ||
      !registerForm.senha ||
      !registerForm.confirmarSenha
    ) {
      setRegisterNotification("Preencha todos os campos obrigatórios.");
      return;
    }
    if (registerForm.senha !== registerForm.confirmarSenha) {
      setRegisterNotification("As senhas não coincidem.");
      return;
    }
    setRegisterNotification("Cadastro simulado realizado com sucesso! (Funcionalidade em desenvolvimento)");
  };

  // Esqueci minha senha simulado
  const handleForgotChange = (e) => {
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotForm.email) {
      setForgotNotification("Informe seu e-mail ou usuário.");
      return;
    }
    setForgotNotification("Se este e-mail/usuário existir, um link de recuperação foi enviado. (Simulação)");
  };

  if (showRegister) {
    return (
      <Container maxWidth="xs" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Cadastro (simulação)
          </Typography>
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Nome"
              name="nome"
              value={registerForm.nome}
              onChange={handleRegisterChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Sobrenome"
              name="sobrenome"
              value={registerForm.sobrenome}
              onChange={handleRegisterChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="E-mail"
              name="email"
              type="email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Celular"
              name="celular"
              value={registerForm.celular}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={registerForm.telefone}
              onChange={handleRegisterChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Senha"
              name="senha"
              type="password"
              value={registerForm.senha}
              onChange={handleRegisterChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Confirmar Senha"
              name="confirmarSenha"
              type="password"
              value={registerForm.confirmarSenha}
              onChange={handleRegisterChange}
              fullWidth
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1, minHeight: 48 }}
            >
              Cadastrar
            </Button>
          </Box>
          {registerNotification && (
            <Alert severity={registerNotification.includes("sucesso") ? "success" : "error"} sx={{ mt: 2 }}>
              {registerNotification}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => setShowRegister(false)}>
              Voltar ao Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (showForgot) {
    return (
      <Container maxWidth="xs" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Recuperar Senha (simulação)
          </Typography>
          <Box component="form" onSubmit={handleForgotSubmit} sx={{ mt: 2 }}>
            <TextField
              label="E-mail ou usuário"
              name="email"
              value={forgotForm.email}
              onChange={handleForgotChange}
              fullWidth
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1, minHeight: 48 }}
            >
              Confirmar
            </Button>
          </Box>
          {forgotNotification && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {forgotNotification}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => setShowForgot(false)}>
              Voltar ao Login
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Tela de login padrão
  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="E-mail ou admin"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 1, minHeight: 48 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>
        </Box>
        {notification && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {notification}
          </Alert>
        )}
        <Box sx={{ mt: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => setShowRegister(true)}
            sx={{ mr: 2 }}
          >
            Criar conta
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => setShowForgot(true)}
          >
            Esqueci minha senha
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
