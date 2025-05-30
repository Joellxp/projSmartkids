const { User, Trip, TripStudent, Payment } = require("../models");
const { logAction } = require("../utils/auditLog");

// Criar uma nova viagem
exports.createTrip = async (req, res) => {
  try {
    const { driverId, startTime } = req.body;
    if (!driverId || !startTime) {
      return res.status(400).json({ error: "Condutor e data de início são obrigatórios." });
    }
    const driver = await User.findByPk(driverId);
    if (!driver || driver.role !== "condutor") {
      return res.status(400).json({ error: "Condutor inválido." });
    }
    if (isNaN(Date.parse(startTime)) || new Date(startTime) < new Date()) {
      return res.status(400).json({ error: "Data de início inválida ou no passado." });
    }
    const trip = await Trip.create({ driverId, startTime });
    logAction(`Criou viagem ${trip.id} (condutor: ${driverId})`, req.user.id);

    // Retorno filtrado
    res.status(201).json({
      id: trip.id,
      driverId: trip.driverId,
      startTime: trip.startTime,
      endTime: trip.endTime,
      status: trip.status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar viagem." });
  }
};

// Listar todas as viagens
exports.listTrips = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Trip.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      trips: rows.map(trip => ({
        id: trip.id,
        driverId: trip.driverId,
        startTime: trip.startTime,
        endTime: trip.endTime,
        status: trip.status
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar viagens." });
  }
};

// Finalizar uma viagem
exports.endTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ error: "Viagem não encontrada." });
    trip.endTime = new Date();
    trip.status = "completed";
    await trip.save();
    logAction(`Finalizou viagem ${trip.id}`, req.user.id);

    // Retorno filtrado
    res.json({
      id: trip.id,
      driverId: trip.driverId,
      startTime: trip.startTime,
      endTime: trip.endTime,
      status: trip.status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao finalizar viagem." });
  }
};

// Listar viagens do usuário autenticado
exports.listMyTrips = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === "condutor") {
      where.driverId = req.user.id;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await Trip.findAndCountAll({ where, offset, limit });
    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      trips: rows.map(trip => ({
        id: trip.id,
        driverId: trip.driverId,
        startTime: trip.startTime,
        endTime: trip.endTime,
        status: trip.status
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar viagens." });
  }
};

// Adicionar estudante a uma viagem
exports.addStudentToTrip = async (req, res) => {
  try {
    const { tripId, studentId } = req.body;
    if (!tripId || !studentId) {
      return res.status(400).json({ error: "Viagem e estudante são obrigatórios." });
    }
    const trip = await Trip.findByPk(tripId);
    const student = await User.findByPk(studentId);
    if (!trip || !student) {
      return res.status(404).json({ error: "Viagem ou estudante não encontrado." });
    }
    const exists = await TripStudent.findOne({ where: { tripId, studentId } });
    if (exists) {
      return res.status(400).json({ error: "Estudante já está associado a esta viagem." });
    }
    await TripStudent.create({ tripId, studentId });
    logAction(`Adicionou estudante ${studentId} à viagem ${tripId}`, req.user.id);
    res.status(201).json({ message: "Estudante adicionado à viagem." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar estudante à viagem." });
  }
};

// Marcar presença do estudante em uma viagem
exports.markStudentPresence = async (req, res) => {
  try {
    const { tripId, studentId } = req.body;
    const tripStudent = await TripStudent.findOne({ where: { tripId, studentId } });
    if (req.user.role !== "condutor" || req.user.id !== trip.driverId) {
    return res.status(403).json({ error: "Acesso negado." });
    }
    if (!tripStudent) {
      return res.status(404).json({ error: "Associação não encontrada." });
    }
    if (tripStudent.present) {
      return res.status(400).json({ error: "Presença já foi marcada para este estudante nesta viagem." });
    }
    tripStudent.present = true;
    await tripStudent.save();
    logAction(`Marcou presença do estudante ${studentId} na viagem ${tripId}`, req.user.id);
    res.json({ message: "Presença marcada com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao marcar presença." });
  }
};

// Listar estudantes de uma viagem
exports.listStudentsInTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await TripStudent.findAndCountAll({
      where: { tripId },
      offset,
      limit,
      include: [{
        model: User,
        as: "student",
        attributes: ["id", "fullName", "username", "role"]
      }]
    });

    const students = rows.map(row => ({
      ...row.student.dataValues,
      present: row.present
    }));

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar estudantes da viagem." });
  }
};

// Listar viagens dos estudantes do responsável
exports.listTripsOfResponsible = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const students = await User.findAll({ where: { responsibleId: req.user.id } });
    const studentIds = students.map(s => s.id);

    const { count, rows } = await Trip.findAndCountAll({
      include: [{
        model: User,
        as: "students",
        where: { id: studentIds }
      }],
      offset,
      limit
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      trips: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar viagens dos estudantes." });
  }
};