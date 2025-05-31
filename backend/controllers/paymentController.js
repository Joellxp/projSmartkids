const { Payment } = require('../models');
const { sendPaymentNotification } = require("../services/emailService");
const User = require("../models/User");
const Trip = require("../models/Trip");
const { logAction } = require("../utils/auditLog");

// Criar pagamento
async function createPayment(req, res, next) {
  try {
    const { userId, tripId, amount } = req.body;

    if (!userId || !tripId || amount === undefined) {
      const err = new Error("Usuário, viagem e valor do pagamento são obrigatórios.");
      err.status = 400;
      throw err;
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      const err = new Error("O valor do pagamento deve ser maior que zero.");
      err.status = 400;
      throw err;
    }
    const paymentUser = await User.findByPk(userId);
    if (!paymentUser) {
      const err = new Error("Usuário não encontrado.");
      err.status = 404;
      throw err;
    }
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      const err = new Error("Viagem não encontrada.");
      err.status = 404;
      throw err;
    }
    if (req.user.role === "common" && req.user.id !== userId) {
      const err = new Error("Você só pode pagar por você mesmo.");
      err.status = 403;
      throw err;
    }
    const existing = await Payment.findOne({
      where: {
        userId,
        tripId,
        status: ["pending", "paid"],
      },
    });
    if (existing) {
      const err = new Error("Já existe um pagamento para este usuário e viagem.");
      err.status = 400;
      throw err;
    }
    if (req.user.role === "responsavel") {
      if (!paymentUser || paymentUser.responsibleId !== req.user.id) {
        const err = new Error("Você só pode pagar pelos seus estudantes.");
        err.status = 403;
        throw err;
      }
    }

    const payment = await Payment.create({ userId, tripId, amount });
    logAction(`Criou pagamento para viagem ${tripId} (valor: R$${amount})`, req.user.id);

    res.status(201).json({
      id: payment.id,
      userId: payment.userId,
      tripId: payment.tripId,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate
    });
  } catch (error) {
    next(error);
  }
}

// Listar todos os pagamentos
async function listPayments(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      const err = new Error("Acesso restrito ao administrador.");
      err.status = 403;
      throw err;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      payments: rows.map(payment => ({
        id: payment.id,
        userId: payment.userId,
        tripId: payment.tripId,
        amount: payment.amount,
        status: payment.status,
        paymentDate: payment.paymentDate
      }))
    });
  } catch (error) {
    next(error);
  }
}

// Buscar status do pagamento
async function getPaymentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
      const err = new Error("Acesso negado.");
      err.status = 403;
      throw err;
    }
    if (!payment) {
      const err = new Error("Pagamento não encontrado.");
      err.status = 404;
      throw err;
    }
    res.json({ status: payment.status });
  } catch (error) {
    next(error);
  }
}

// Marcar pagamento como pago
async function markAsPaid(req, res, next) {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (req.user.role !== "admin") {
      const err = new Error("Acesso restrito ao administrador.");
      err.status = 403;
      throw err;
    }
    if (!payment) {
      const err = new Error("Pagamento não encontrado.");
      err.status = 404;
      throw err;
    }
    payment.status = "paid";
    payment.paymentDate = new Date();
    await payment.save();
    logAction(`Marcou pagamento ${payment.id} como pago`, req.user.id);

    res.json({
      id: payment.id,
      userId: payment.userId,
      tripId: payment.tripId,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate
    });
  } catch (error) {
    next(error);
  }
}

// Listar pagamentos de um usuário específico
async function listPaymentsByUser(req, res, next) {
  try {
    const userId = parseInt(req.params.userId);
    if (req.user.role !== "admin" && req.user.id !== userId) {
      const err = new Error("Acesso negado.");
      err.status = 403;
      throw err;
    }
    const payments = await Payment.findAll({ where: { userId } });
    res.json(payments.map(payment => ({
      id: payment.id,
      userId: payment.userId,
      tripId: payment.tripId,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate
    })));
  } catch (error) {
    next(error);
  }
}

// Listar pagamentos de uma viagem específica
async function listPaymentsByTrip(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId);
    if (req.user.role !== "admin") {
      const err = new Error("Acesso restrito ao administrador.");
      err.status = 403;
      throw err;
    }
    const payments = await Payment.findAll({ where: { tripId } });
    res.json(payments.map(payment => ({
      id: payment.id,
      userId: payment.userId,
      tripId: payment.tripId,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate
    })));
  } catch (error) {
    next(error);
  }
}

// Buscar pagamento por ID
async function getPayment(req, res, next) {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      const err = new Error("Pagamento não encontrado");
      err.status = 404;
      throw err;
    }
    res.json(payment);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPayment,
  listPayments,
  getPaymentStatus,
  markAsPaid,
  listPaymentsByUser,
  listPaymentsByTrip,
  getPayment
};