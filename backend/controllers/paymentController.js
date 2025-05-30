const Payment = require("../models/Payment");
const { sendPaymentNotification } = require("../services/emailService");
const User = require("../models/User");
const Trip = require("../models/Trip");
const { logAction } = require("../utils/auditLog");

// Criar pagamento
exports.createPayment = async (req, res) => {
  try {
    const { userId, tripId, amount } = req.body;

    // Validação manual dos campos obrigatórios com mensagens claras
    if (!userId || !tripId || amount === undefined) {
      return res.status(400).json({ error: "Usuário, viagem e valor do pagamento são obrigatórios." });
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "O valor do pagamento deve ser maior que zero." });
    }
    const paymentUser = await User.findByPk(userId);
    if (!paymentUser) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ error: "Viagem não encontrada." });
    }
    // Impede que um usuário comum crie pagamento para outro
    if (req.user.role === "common" && req.user.id !== userId) {
      return res.status(403).json({ error: "Você só pode pagar por você mesmo." });
    }
    // Impede duplicidade de pagamento
    const existing = await Payment.findOne({
      where: {
        userId,
        tripId,
        status: ["pending", "paid"],
      },
    });
    if (existing) {
      return res.status(400).json({ error: "Já existe um pagamento para este usuário e viagem." });
    }
    // Se o usuário autenticado for responsável, só pode criar pagamento para seus estudantes
    if (req.user.role === "responsavel") {
      if (!paymentUser || paymentUser.responsibleId !== req.user.id) {
        return res.status(403).json({
          error: "Você só pode pagar pelos seus estudantes.",
        });
      }
    }

    const payment = await Payment.create({ userId, tripId, amount });
    logAction(`Criou pagamento para viagem ${tripId} (valor: R$${amount})`, req.user.id);

    // Retorno filtrado
    res.status(201).json({
      id: payment.id,
      userId: payment.userId,
      tripId: payment.tripId,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pagamento." });
  }
};

// Listar todos os pagamentos
exports.listPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      logAction("Tentativa de acesso negado à listagem de pagamentos", req.user.id);
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
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
    console.error(error);
    res.status(500).json({ error: "Erro ao listar pagamentos." });
  }
};

// Buscar status do pagamento
exports.getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: "Acesso negado." });
    }
    if (!payment)
      return res.status(404).json({ error: "Pagamento não encontrado." });
    res.json({ status: payment.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar status do pagamento." });
  }
};

// Marcar pagamento como pago
exports.markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
    }
    if (!payment)
      return res.status(404).json({ error: "Pagamento não encontrado." });
    payment.status = "paid";
    payment.paymentDate = new Date();
    await payment.save();
    logAction(`Marcou pagamento ${payment.id} como pago`, req.user.id);

    // Retorno filtrado
    res.json({
      id: payment.id,
      userId: payment.userId,
      tripId: payment.tripId,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.paymentDate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar pagamento." });
  }
};

// Listar pagamentos de um usuário específico
exports.listPaymentsByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (req.user.role !== "admin" && req.user.id !== userId) {
      logAction("Tentativa de acesso negado aos pagamentos de outro usuário", req.user.id);
      return res.status(403).json({ error: "Acesso negado." });
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
    console.error(error);
    res.status(500).json({ error: "Erro ao listar pagamentos do usuário." });
  }
};

// Listar pagamentos de uma viagem específica
exports.listPaymentsByTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    if (req.user.role !== "admin") {
      logAction("Tentativa de acesso negado aos pagamentos de uma viagem", req.user.id);
      return res.status(403).json({ error: "Acesso restrito ao administrador." });
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
    console.error(error);
    res.status(500).json({ error: "Erro ao listar pagamentos da viagem." });
  }
};