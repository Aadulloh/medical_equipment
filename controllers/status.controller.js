const { errorHandler } = require("../helpers/error_handler");
const Contracts = require("../models/contracts.model");
const Status = require("../models/status.model");

const addNewStatus = async (req, res) => {
  try {
    const { name } = req.body;

    const newStatus = await Status.create({
      name,
    });

    res.status(201).send({ message: "Yangi Status qo'shildi", newStatus });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllStatus = async (req, res) => {
  try {
    const statsList = await Status.findAll({
      include: [Contracts],
    });

    res.status(200).send({
      message: "Statuslar ro'yxati",
      statsList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const stat = await Status.findByPk(id);

    if (!stat) {
      return res.status(404).send({ message: "Status topilmadi" });
    }

    res.status(200).send({ message: "Status topildi", stat });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const stat = await Status.findByPk(id);

    if (!stat) {
      return res.status(404).send({ message: "Status topilmadi" });
    }

    await stat.destroy();

    res.status(200).send({ message: "Status o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const stat = await Status.findByPk(id);

    if (!stat) {
      return res.status(404).send({ message: "Status topilmadi" });
    }

    await stat.update({ name });

    res.status(200).send({
      message: "Status yangilandi",
      stat,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewStatus,
  findAllStatus,
  findStatusById,
  deleteStatus,
  updateStatus,
};
