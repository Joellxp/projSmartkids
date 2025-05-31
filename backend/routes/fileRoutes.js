const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const fileController = require("../controllers/fileController");

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const pdfUpload = multer({ storage });

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Faz upload de um arquivo PDF
 *     tags: [Arquivos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo enviado
 */
router.post('/', authMiddleware, pdfUpload.single('file'), fileController.uploadFile);

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Lista arquivos PDF
 *     tags: [Arquivos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de arquivos
 */
router.get('/', authMiddleware, fileController.listFiles);

// Deletar arquivo PDF
router.delete('/:name', authMiddleware, (req, res) => {
  fs.unlinkSync(path.join('./uploads/', req.params.name));
  res.json({ message: "Arquivo deletado" });
});

module.exports = router;
