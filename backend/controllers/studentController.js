const { User, Trip, TripStudent, Payment, Student } = require("../models");
const { logAction } = require("../utils/auditLog");

async function getStudentPresenceHistory(req, res, next) {
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
      const error = new Error("Acesso negado.");
      error.status = 403;
      throw error;
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
    if (!error.status) error.status = 500;
    error.message = error.status === 500 ? "Erro ao buscar histórico de presença." : error.message;
    next(error);
  }
}

async function getStudent(req, res, next) {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      const err = new Error("Estudante não encontrado");
      err.status = 404;
      throw err;
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
}

async function createStudent(req, res, next) {
  try {
    if (!req.body.name) {
      const err = new Error("Nome é obrigatório");
      err.status = 400;
      throw err;
    }
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStudentPresenceHistory,
  getStudent,
  createStudent
};