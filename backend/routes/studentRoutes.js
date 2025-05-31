const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /students/{studentId}/presence-history:
 *   get:
 *     summary: Lista o histórico de presença de um estudante
 *     tags: [Estudantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico de presença retornado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Estudante não encontrado
 */
router.get("/:studentId/presence-history", authMiddleware, studentController.getStudentPresenceHistory);
router.get("/:id", authMiddleware, studentController.getStudent);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Estudantes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudante criado
 *       400:
 *         description: Dados inválidos
 */
router.post("/", authMiddleware, studentController.createStudent);

module.exports = router;