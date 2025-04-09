const { errorHandler } = require("../helpers/error_handler");
const Categories = require("../models/categories.model");
const Clients = require("../models/clients.model");
const Contracts = require("../models/contracts.model");
const Owners = require("../models/owners.model");
const Payments = require("../models/payments.model");
const Products = require("../models/products.model");
const Status = require("../models/status.model");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

const addNewContract = async (req, res) => {
  try {
    const {
      clientId,
      productId,
      start_date,
      end_date,
      statusId,
      demage_report,
    } = req.body;

    const newContract = await Contracts.create({
      clientId,
      productId,
      start_date,
      end_date,
      statusId,
      demage_report,
    });

    res.status(201).send({ message: "Yangi Contract qo'shildi", newContract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllContracts = async (req, res) => {
  try {
    const contractsList = await Contracts.findAll({
      include: [
        { model: Clients },
        { model: Products, include: [Categories, Owners] },
        { model: Status },
        { model: Payments },
      ],
    });

    res.status(200).send({
      message: "Contractlar ro'yxati",
      contractsList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contracts.findByPk(id);

    if (!contract) {
      return res.status(404).send({ message: "Contract topilmadi" });
    }

    res.status(200).send({ message: "Contract topildi", contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contracts.findByPk(id);

    if (!contract) {
      return res.status(404).send({ message: "Contract topilmadi" });
    }

    await contract.destroy();

    res.status(200).send({ message: "Contract o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientId,
      productId,
      start_date,
      end_date,
      statusId,
      demage_report,
    } = req.body;

    const contract = await Contracts.findByPk(id);

    if (!contract) {
      return res.status(404).send({ message: "Contract topilmadi" });
    }

    await contract.update({
      clientId,
      productId,
      start_date,
      end_date,
      statusId,
      demage_report,
    });

    res.status(200).send({
      message: "Contract yangilandi",
      contract,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};



module.exports = {
  addNewContract,
  findAllContracts,
  findContractById,
  deleteContract,
  updateContract,
};
