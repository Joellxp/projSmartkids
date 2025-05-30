const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const roleMiddleware = require("../middleware/roleMiddleware");

// Apenas condutores podem criar e finalizar viagens
router.post("/", roleMiddleware("condutor"), tripController.createTrip);
router.put("/:id/end", roleMiddleware("condutor"), tripController.endTrip);

// Listar todas as viagens (admin ou público, conforme sua regra)
router.get("/", tripController.listTrips);

// Listar viagens do usuário autenticado
router.get("/me", tripController.listMyTrips);

// Adicionar estudante a uma viagem (apenas condutor)
router.post("/add-student", roleMiddleware("condutor"), tripController.addStudentToTrip);

// Marcar presença do estudante (apenas condutor)
router.post("/mark-presence", roleMiddleware("condutor"), tripController.markStudentPresence);

// Listar estudantes em uma viagem
router.get("/:tripId/students", tripController.listStudentsInTrip);

// Apenas responsáveis podem acessar
router.get("/responsible/my-students-trips", roleMiddleware("responsavel"), tripController.listTripsOfResponsible);

module.exports = router;