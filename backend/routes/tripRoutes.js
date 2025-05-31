const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Lista todas as viagens
 *     tags: [Viagens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de viagens
 */
router.get('/', authMiddleware, tripController.listTrips);

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Cria uma nova viagem
 *     tags: [Viagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               destino:
 *                 type: string
 *     responses:
 *       201:
 *         description: Viagem criada
 *       400:
 *         description: Dados inválidos
 */
router.post("/", authMiddleware, tripController.createTrip);
router.put("/:id/end", roleMiddleware("condutor"), tripController.endTrip);

// Listar viagens do usuário autenticado
router.get("/me", tripController.listMyTrips);

// Adicionar estudante a uma viagem (apenas condutor)
router.post("/:id/student", roleMiddleware("condutor"), tripController.addStudentToTrip);

// Marcar presença do estudante (apenas condutor)
router.post("/mark-presence", roleMiddleware("condutor"), tripController.markStudentPresence);

// Listar estudantes em uma viagem
router.get("/:tripId/students", tripController.listStudentsInTrip);

// Apenas responsáveis podem acessar
router.get("/responsible/my-students-trips", roleMiddleware("responsavel"), tripController.listTripsOfResponsible);

module.exports = router;