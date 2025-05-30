const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const pdfUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Somente PDFs são permitidos'));
  }
});

// Upload de arquivo PDF
router.post('/', authMiddleware, pdfUpload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

// Listar arquivos PDF
router.get('/', authMiddleware, (req, res) => {
  const files = fs.readdirSync('./uploads/');
  const pdfs = files.filter(file => file.endsWith('.pdf'));
  res.json(pdfs);
});

// Deletar arquivo PDF
router.delete('/:name', authMiddleware, (req, res) => {
  fs.unlinkSync(path.join('./uploads/', req.params.name));
  res.json({ message: "Arquivo deletado" });
});

module.exports = router;
