const { errorHandler } = require("../helpers/error_handler");
const Clients = require("../models/clients.model");
const Contracts = require("../models/contracts.model");
const Payments = require("../models/payments.model");
const Products = require("../models/products.model");
const sequelize = require("../config/db");

const addNewPayment = async (req, res) => {
  try {
    const { contractId, emount, payment_date, payment_method } = req.body;

    const newPayment = await Payments.create({
      contractId,
      emount,
      payment_date,
      payment_method,
    });

    res.status(201).send({ message: "Yangi Payment qo'shildi", newPayment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllPayments = async (req, res) => {
  try {
    const paymentsList = await Payments.findAll({
      include: {
        model: Contracts,
        include: [{ model: Clients }, { model: Products }],
      },
    });

    res.status(200).send({
      message: "Paymentlar ro'yxati",
      paymentsList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payments.findByPk(id);

    if (!payment) {
      return res.status(404).send({ message: "Payment topilmadi" });
    }

    res.status(200).send({ message: "Payment topildi", payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payments.findByPk(id);

    if (!payment) {
      return res.status(404).send({ message: "Payment topilmadi" });
    }

    await payment.destroy();

    res.status(200).send({ message: "Payment o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { contractId, emount, payment_date, payment_method } = req.body;

    const payment = await Payments.findByPk(id);

    if (!payment) {
      return res.status(404).send({ message: "Payment topilmadi" });
    }

    await payment.update({ contractId, emount, payment_date, payment_method });

    res.status(200).send({
      message: "Payment yangilandi",
      payment,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewPayment,
  findAllPayments,
  findPaymentById,
  deletePayment,
  updatePayment,
};
