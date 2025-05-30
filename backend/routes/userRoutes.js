const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

const pdfUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Somente PDFs são permitidos'));
  }
});

// Rotas de usuários
router.get("/", authMiddleware, userController.listUsers);
router.post("/", authMiddleware, userController.createUser);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.get("/:id", authMiddleware, userController.getUserById);

// Upload de foto de usuário
router.post('/:id/photo', authMiddleware, upload.single('photo'), userController.uploadUserPhoto);

module.exports = router;
