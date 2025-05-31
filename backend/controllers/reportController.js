const { User, Trip, TripStudent, Payment, Report } = require("../models");
const { logAction } = require("../utils/auditLog");

exports.getTotals = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      logAction("Tentativa de acesso negado ao relatório de totais", req.user.id);
      const error = new Error("Acesso restrito ao administrador.");
      error.status = 403;
      throw error;
    }
    const users = await User.count();
    const trips = await Trip.count();
    const payments = await Payment.count();
    res.json({ users, trips, payments });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
      error.message = "Erro ao gerar relatório.";
    }
    next(error);
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      const err = new Error("Relatório não encontrado");
      err.status = 404;
      throw err;
    }
    res.json(report);
  } catch (error) {
    next(error);
  }
};

exports.createReport = async (req, res, next) => {
  try {
    if (!req.body.titulo) {
      const err = new Error("Título é obrigatório");
      err.status = 400;
      throw err;
    }
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
};