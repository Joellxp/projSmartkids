const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const sequelize = require("./database/db");
const User = require("./models/User");
const Trip = require("./models/Trip");
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const fileRoutes = require("./routes/fileRoutes");
const tripRoutes = require("./routes/tripRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const studentRoutes = require("./routes/studentRoutes");
const path = require('path');

require("./models"); // Isso aplica os relacionamentos

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rota de usuários
app.use("/users", authMiddleware, userRoutes);
// Rota de arquivos
app.use("/files", fileRoutes);
// Rota de viagens
app.use("/trips", authMiddleware, tripRoutes);
// Rota de pagamentos
app.use("/payments", paymentRoutes);
// Rota de relatórios
app.use("/reports", reportRoutes);
// Rota de estudantes
app.use("/students", studentRoutes);

// Rota de upload de arquivos
app.use('/uploads', express.static('uploads'));

// Importação do JWT
const jwt = require("jsonwebtoken");

const accessSecret = "chave_acesso_super_secreta";
const refreshSecret = "chave_refresh_token_super_secreta";

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	
	// Busca usuário no banco
	const user = await User.findOne({ where: { username } });
	
	// Verifica se usuário existe e a senha está correta
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).json({ error: "Credenciais inválidas" });
	}
	
	// Gera access token (válido por 30 minutos)
	const accessToken = jwt.sign(
		{ username: user.username, role: user.role },
		accessSecret,
		{ expiresIn: "30m" }
	);
	
	// Gera refresh token (válido por 7 dias)
	const refreshToken = jwt.sign(
		{ username: user.username },
		refreshSecret,
		{ expiresIn: "7d" }
	);
	
	// Envia os tokens ao frontend
	res.json({ 
		accessToken, 
		refreshToken, 
		role: user.role,
		photo: user.photo, 
		fullName: user.fullName 
	});
});

// Função para criar o usuário admin inicial
const createAdminUser = async () => {
	const adminExists = await User.findOne({ where: { username: "admin" } });
	if (!adminExists) {
		const hashedPassword = await bcrypt.hash("1234", 10); // Criptografa a senha
		await User.create({
			fullName: "Administrador",
			username: "admin",
			password: hashedPassword,
			role: "admin",
		});
		console.log("Usuário admin criado com sucesso!");
	}
};

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync()
	.then(() => {
		// Cria o usuário admin ao iniciar o servidor
		createAdminUser().then(() => {
			app.listen(port, () => {
				console.log(`Servidor rodando em http://localhost:${port}`);
			});
		});
	})
	.catch(err => {
		console.error("Erro ao sincronizar o banco de dados:", err);
	});

// No final das rotas do backend:
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});