const config = require("config");
const { errorHandler } = require("../helpers/error_handler");
const Clients = require("../models/clients.model");
const Contracts = require("../models/contracts.model");
const Payments = require("../models/payments.model");
const Products = require("../models/products.model");
const Status = require("../models/status.model");
const jwtService = require("../services/jwt.service");
const mailService = require("../services/mail.service");

const addNewClient = async (req, res) => {
  try {
    const { full_name, email, passport, phone, address, is_active } = req.body;

    const newClient = await Clients.create({
      full_name,
      email,
      passport,
      phone,
      address,
      is_active,
    });

    res.status(201).send({ message: "Yangi Client qo'shildi", newClient });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllClients = async (req, res) => {
  try {
    const clientsList = await Clients.findAll({
      include: {
        model: Contracts,
        include: [{ model: Products }, { model: Status }, { model: Payments }],
      },
    });

    res.status(200).send({
      message: "Clientlar ro'yxati",
      clientsList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Clients.findByPk(id);

    if (!client) {
      return res.status(404).send({ message: "Client topilmadi" });
    }

    res.status(200).send({ message: "Client topildi", client });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Clients.findByPk(id);

    if (!client) {
      return res.status(404).send({ message: "Client topilmadi" });
    }

    await client.destroy();

    res.status(200).send({ message: "Client o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, passport, phone, address } = req.body;

    const client = await Clients.findByPk(id);

    if (!client) {
      return res.status(404).send({ message: "Client topilmadi" });
    }

    await client.update({ full_name, email, passport, phone, address });

    res.status(200).send({
      message: "Client yangilandi",
      client,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logIn = async (req, res) => {
  try {
    const { full_name, email } = req.body;

    const client = await Clients.findOne({ where: { email, full_name } });

    if (!client) {
      return res.status(400).send({ message: "Bunday Client yoq !" });
    }

    const payload = {
      id: client.id,
      email: client.email,
      role: "user",
      is_active: client.is_active,
    };
    const token = jwtService.generateTokens(payload);

    await client.update({ refresh_token: token.refreshToken });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    client.is_active = true;
    await client.save();
    await mailService.sendActivationMail(client.email, client.full_name);

    res.status(200).send({
      message: "Tizimga xush kelibsiz !",
      accessToken: token.accessToken,
      client: {
        id: client.id,
        full_name: client.full_name,
        email: client.email,
        phone: client.phone,
      },
    });
  } catch (error) {
    errorHandler(error);
  }
};

const logOutClient = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Cookie-da refresh token topilmadi!",
      });
    }

    const client = await Clients.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!client) {
      return res.status(404).json({
        message: "Bunday token bilan Client topilmadi!",
      });
    }

    client.refresh_token = null;
    client.is_active = false;
    await client.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Client muvaffaqiyatli tizimdan chiqdi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshClientToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kirishingiz kerak !",
      });
    }

    const decodedToken = await jwtService.verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token !",
      });
    }

    const client = await Clients.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client topilmadi yoki avval tizimdan chiqib bo'lingan !",
      });
    }

    const payload = {
      id: client.id,
      email: client.email,
      is_active: client.is_active,
      role: "user",
    };

    const tokens = jwtService.generateTokens(payload);

    await client.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tokenlar muvaffaqiyatli yangilandi !",
      accessToken: tokens.accessToken,
      client: {
        id: client.id,
        full_name: client.full_name,
        email: client.email,
        phone: client.phone,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewClient,
  findAllClients,
  findClientById,
  deleteClient,
  updateClient,
  logIn,
  logOutClient,
  refreshClientToken,
};
