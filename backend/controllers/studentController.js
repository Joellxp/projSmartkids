const { User, Trip, TripStudent, Payment } = require("../models");
const { logAction } = require("../utils/auditLog");

exports.getStudentPresenceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Permite apenas admin, o próprio estudante ou o responsável acessar
    const student = await User.findByPk(studentId);
    if (
      req.user.role !== "admin" &&
      req.user.id !== parseInt(studentId) &&
      !(req.user.role === "responsavel" && student.responsibleId === req.user.id)
    ) {
      logAction("Tentativa de acesso negado ao histórico de presença de outro estudante", req.user.id);
      return res.status(403).json({ error: "Acesso negado." });
    }

    const history = await TripStudent.findAll({
      where: { studentId },
      include: [{ model: Trip, as: "trip" }]
    });
    res.json(history.map(h => ({
      tripId: h.tripId,
      present: h.present,
      trip: {
        id: h.trip.id,
        driverId: h.trip.driverId,
        startTime: h.trip.startTime,
        endTime: h.trip.endTime,
        status: h.trip.status
      }
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar histórico de presença." });
  }
};