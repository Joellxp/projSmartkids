const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Cria um pagamento
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               tripId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pagamento criado
 */
router.post("/", authMiddleware, paymentController.createPayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lista todos os pagamentos
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 */
router.get("/", authMiddleware, paymentController.listPayments);

/**
 * @swagger
 * /payments/user/{userId}:
 *   get:
 *     summary: Lista pagamentos de um usuário
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pagamentos do usuário
 */
router.get("/user/:userId", authMiddleware, paymentController.listPaymentsByUser);

/**
 * @swagger
 * /payments/trip/{tripId}:
 *   get:
 *     summary: Lista pagamentos de uma viagem
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pagamentos da viagem
 */
router.get("/trip/:tripId", authMiddleware, paymentController.listPaymentsByTrip);

/**
 * @swagger
 * /payments/{id}/status:
 *   get:
 *     summary: Busca status de um pagamento
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status do pagamento
 */
router.get("/:id/status", authMiddleware, paymentController.getPaymentStatus);

/**
 * @swagger
 * /payments/{id}/pay:
 *   put:
 *     summary: Marca pagamento como pago
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagamento marcado como pago
 */
router.put("/:id/pay", authMiddleware, paymentController.markAsPaid);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Busca pagamento por ID
 *     tags: [Pagamentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 */
router.get("/:id", authMiddleware, paymentController.getPayment);

module.exports = router;