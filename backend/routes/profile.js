const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const { User } = require("../models");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.userId}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Arquivo inválido"));
    cb(null, true);
  }
});

// GET /profile - retorna dados do usuário autenticado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "fullName", "username", "role", "photo"]
    });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

// PATCH /profile - atualiza dados do usuário autenticado
router.patch("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.username) user.username = req.body.username;
    if (req.body.password && req.body.password.length >= 4) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    // Adicione outros campos se necessário (ex: photo)

    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

// PATCH /profile/photo - upload de foto de perfil
router.patch("/photo", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Arquivo não enviado" });
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    user.photo = req.file.filename;
    await user.save();
    res.json({ photo: user.photo });
  } catch (err) {
    res.status(500).json({ error: "Erro ao enviar foto" });
  }
});

module.exports = router;