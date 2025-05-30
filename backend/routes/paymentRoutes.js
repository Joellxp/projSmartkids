const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

// Criar pagamento
router.post("/", authMiddleware, paymentController.createPayment);
// Listar pagamentos
router.get("/", authMiddleware, paymentController.listPayments);
// Listar pagamentos de um usuário
router.get("/user/:userId", authMiddleware, paymentController.listPaymentsByUser);
// Listar pagamentos de uma viagem
router.get("/trip/:tripId", authMiddleware, paymentController.listPaymentsByTrip);
// Buscar status do pagamento
router.get("/:id/status", authMiddleware, paymentController.getPaymentStatus);
// Marcar pagamento como pago
router.put("/:id/pay", authMiddleware, paymentController.markAsPaid);

module.exports = router;