const { User, Trip, TripStudent, Payment } = require("../models");
const { logAction } = require("../utils/auditLog");

exports.getTotals = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      logAction("Tentativa de acesso negado ao relatório de totais", req.user.id);
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
    }
    const users = await User.count();
    const trips = await Trip.count();
    const payments = await Payment.count();
    res.json({ users, trips, payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar relatório." });
  }
};