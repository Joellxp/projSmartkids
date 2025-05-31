const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /reports/totals:
 *   get:
 *     summary: Retorna totais do sistema
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Totais retornados
 */
router.get("/totals", authMiddleware, reportController.getTotals);

module.exports = router;