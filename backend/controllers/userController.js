const { User, Trip, TripStudent, Payment } = require("../models");
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const { logAction } = require("../utils/auditLog");

// Listar todos os usuários
exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      logAction("Tentativa de acesso negado à listagem de usuários", req.user.id);
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({ offset, limit });
    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      users: rows.map(user => ({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        photo: user.photo
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
};

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    let { fullName, username, password, role } = req.body;

    // Validação de campos obrigatórios
    if (!fullName || !username || !password || !role) {
      return res.status(400).json({ error: "Nome completo, e-mail, senha e tipo de usuário são obrigatórios." });
    }
    // Validação de formato de e-mail
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      return res.status(400).json({ error: "E-mail inválido." });
    }
    // Validação de tamanho de senha
    if (password.length < 6) {
      return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
    }
    // Validação de tipo de usuário
    if (!["admin", "condutor", "responsavel", "common"].includes(role)) {
      return res.status(400).json({ error: "Tipo de usuário inválido." });
    }
    // Validação de unicidade de e-mail
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    // Sanitização dos campos
    fullName = sanitizeHtml(fullName);
    username = sanitizeHtml(username);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      username,
      password: hashedPassword,
      role
    });
    logAction(`Criou usuário ${user.username} (${user.role})`, req.user.id);

    // Retorno filtrado
    res.status(201).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      photo: user.photo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { fullName, username, password, role } = req.body;
    const user = await User.findByPk(id);
    if (req.user.role !== "admin") {
      logAction("Tentativa de acesso negado a recurso de admin", req.user.id);
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
    }
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    // Sanitização dos campos
    if (fullName) user.fullName = sanitizeHtml(fullName);
    if (username) user.username = sanitizeHtml(username);
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();
    logAction(`Atualizou usuário ${user.username} (${user.role})`, req.user.id);

    // Retorno filtrado
    res.status(201).json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      photo: user.photo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);
    if (req.user.role !== "admin") {
      logAction("Tentativa de acesso negado a recurso de admin", req.user.id);
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
    }
		if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

		await user.destroy();
		logAction(`Deletou usuário ${user.username} (${user.role})`, req.user.id);
		res.json({ message: "Usuário deletado com sucesso." });
	} catch (error) {
    console.error(error);
		res.status(500).json({ error: "Erro ao deletar usuário." });
	}
};

exports.getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);
    if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
      logAction("Tentativa de acesso negado a dados de outro usuário", req.user.id);
      return res.status(403).json({ error: "Acesso negado." });
    }
		if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

		res.json({
			id: user.id,
			fullName: user.fullName,
			username: user.username,
			role: user.role
		});
	} catch (err) {
    console.error(error);
		res.status(500).json({ error: "Erro ao buscar usuário" });
	}
};

// Upload da foto do usuário
exports.uploadUserPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    user.photo = req.file.filename;
    await user.save();

    res.json({ message: "Foto atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar foto:", err);
    res.status(500).json({ error: "Erro ao atualizar foto." });
  }
};

// Upload de arquivo PDF
exports.uploadPdfFile = (req, res) => {
  try {
    res.json({ filename: req.file.filename, message: "Arquivo PDF enviado com sucesso." });
  } catch (err) {
    console.error("Erro ao enviar PDF:", err);
    res.status(500).json({ error: "Erro ao enviar PDF." });
  }
};

// Listar arquivos PDF
exports.listPdfFiles = (req, res) => {
  try {
    const files = fs.readdirSync('./uploads/');
    const pdfs = files.filter(file => file.endsWith('.pdf'));
    res.json(pdfs);
  } catch (err) {
    console.error("Erro ao listar PDFs:", err);
    res.status(500).json({ error: "Erro ao listar PDFs." });
  }
};

// Deletar arquivo PDF
exports.deletePdfFile = (req, res) => {
  try {
    const filePath = path.join('./uploads/', req.params.name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Arquivo deletado com sucesso." });
    } else {
      res.status(404).json({ error: "Arquivo não encontrado." });
    }
  } catch (err) {
    console.error("Erro ao deletar PDF:", err);
    res.status(500).json({ error: "Erro ao deletar PDF." });
  }
};
