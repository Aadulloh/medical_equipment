const { errorHandler } = require("../helpers/error_handler");
const Owners = require("../models/owners.model");
const Contracts = require("../models/contracts.model");
const Products = require("../models/products.model");
const Status = require("../models/status.model");
const Clients = require("../models/clients.model");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const getRentedProductsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const contracts = await Contracts.findAll({
      where: {
        start_date: { [Op.gte]: startDate },
        end_date: { [Op.lte]: endDate },
      },
      include: {
        model: Products,
        attributes: ["name"],
      },
      attributes: ["id", "start_date", "end_date"],
      order: [["start_date", "ASC"]],
    });

    const result = contracts.map((c) => ({
      contract_id: c.id,
      product_name: c.Product?.name,
      start_date: c.start_date,
      end_date: c.end_date,
    }));

    res.status(200).json(result);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getClientsWithDamageReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const contracts = await Contracts.findAll({
      where: {
        demage_report: {
          [Op.ne]: null,
        },
        start_date: {
          [Op.gte]: startDate,
        },
        end_date: {
          [Op.lte]: endDate,
        },
      },
      include: [
        {
          model: Clients,
          attributes: ["full_name", "phone", "email"],
        },
      ],
      attributes: ["demage_report", "start_date", "end_date"],
    });

    const result = contracts.map((contract) => ({
      full_name: contract.Client?.full_name,
      phone: contract.Client?.phone,
      email: contract.Client?.email,
      demage_report: contract.demage_report,
      start_date: contract.start_date,
      end_date: contract.end_date,
    }));

    res.status(200).json(result);
  } catch (err) {
    errorHandler(err, res);
  }
};

const getCancelledClients = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const contracts = await Contracts.findAll({
      where: {
        start_date: { [Op.gte]: startDate },
        end_date: { [Op.lte]: endDate },
      },
      include: [
        {
          model: Clients,
          attributes: ["full_name", "phone", "email"],
        },
        {
          model: Status,
          where: { name: "Bekor qilingan" }, // filter cancelled status
          attributes: ["name"],
        },
      ],
      attributes: ["start_date", "end_date"],
      order: [["start_date", "ASC"]],
    });

    const result = contracts.map((contract) => ({
      full_name: contract.Client?.full_name,
      phone: contract.Client?.phone,
      email: contract.Client?.email,
      status_name: contract.Status?.name,
      start_date: contract.start_date,
      end_date: contract.end_date,
    }));

    res.status(200).json(result);
  } catch (err) {
    errorHandler(res, err);
  }
};

getTopOwnersByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const owners = await Owners.findAll({
      attributes: [
        "id",
        "full_name",
        [
          Sequelize.fn("COUNT", Sequelize.col("products.contracts.id")),
          "rental_count",
        ],
      ],
      include: [
        {
          model: Products,
          attributes: [],
          required: true,
          where: { categoryId: categoryId },
          include: [
            {
              model: Contracts,
              attributes: [],
              required: true,
            },
          ],
        },
      ],
      group: ["owners.id"],
      order: [[Sequelize.literal("rental_count"), "DESC"]],
    });

    res.status(200).json(owners);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getClientPaymentsInfo = async (req, res) => {
  try {
    const { fullName, phone } = req.body;

    const [results] = await sequelize.query(
      `
      SELECT 
        cat."name" AS category_name,
        p."name" AS product_name,
        o."full_name" AS owner_name,
        pay."emount",
        pay."payment_date",
        pay."payment_method"
      FROM payments pay
      JOIN contracts c ON pay."contractId" = c."id"
      JOIN products p ON c."productId" = p."id"
      JOIN categories cat ON p."categoryId" = cat."id"
      JOIN owners o ON p."ownerId" = o."id"
      JOIN clients cl ON c."clientId" = cl."id"
      WHERE cl."full_name" = :fullName AND cl."phone" = :phone
      `,
      {
        replacements: { fullName, phone },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.send({ message: results });
  } catch (err) {
    console.log(err);
    errorHandler(res, err);
  }
};

module.exports = {
  getRentedProductsByDateRange,
  getClientsWithDamageReport,
  getCancelledClients,
  getTopOwnersByCategory,
  getClientPaymentsInfo,
};
