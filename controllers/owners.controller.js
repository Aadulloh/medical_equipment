const { errorHandler } = require("../helpers/error_handler");
const Owners = require("../models/owners.model");
const Products = require("../models/products.model");
const sequelize = require("../config/db");
const mailService = require("../services/mail.service");
const jwtServiceOwners = require("../services/jwtowner.service");
const bcrypt = require("bcrypt");
const config = require("config");

const addNewOwner = async (req, res) => {
  try {
    const { full_name, email, password, phone, address } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 7);

    const newOwner = await Owners.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).send({ message: "Yangi Owner qo'shildi", newOwner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllOwners = async (req, res) => {
  try {
    const ownersList = await Owners.findAll({
      include: [Products],
    });

    res.status(200).send({
      message: "Ownerlar ro'yxati",
      ownersList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owners.findByPk(id);

    if (!owner) {
      return res.status(404).send({ message: "Owner topilmadi" });
    }

    res.status(200).send({ message: "Owner topildi", owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owners.findByPk(id);

    if (!owner) {
      return res.status(404).send({ message: "Owner topilmadi" });
    }

    await owner.destroy();

    res.status(200).send({ message: "Owner o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, phone, address } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 7);

    const owner = await Owners.findByPk(id);

    if (!owner) {
      return res.status(404).send({ message: "Owner topilmadi" });
    }

    await owner.update({
      full_name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(200).send({
      message: "Owner yangilandi",
      owner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owners.findOne({ where: { email } });
    if (!owner) {
      return res.status(400).send({ message: "Email yoki parol xato !" });
    }

    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki parol xato !" });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      role: "user",
      is_active: owner.is_active,
    };

    const token = jwtServiceOwners.generateTokens(payload);

    await owner.update({ refresh_token: token.refreshToken });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    owner.is_active = true;
    await owner.save();
    await mailService.sendActivationMail(owner.email, owner.full_name);

    res.status(200).send({
      message: "Tizimga xush kelibsiz !",
      accessToken: token.accessToken,
      owner: {
        id: owner.id,
        full_name: owner.full_name,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logOutOwner = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Cookie-da refresh token topilmadi!",
      });
    }

    const owner = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!owner) {
      return res.status(404).json({
        message: "Bunday token bilan Owner topilmadi!",
      });
    }

    owner.refresh_token = null;
    owner.is_active = false;
    await owner.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Owner muvaffaqiyatli tizimdan chiqdi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshOwnertToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kirishingiz kerak !",
      });
    }

    const decodedToken = await jwtServiceOwners.verifyRefreshToken(
      refreshToken
    );
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token",
      });
    }

    const owner = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi yoki avval tizimdan chiqib bo'lingan",
      });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      role: "user",
      is_active: owner.is_active,
    };

    const tokens = jwtServiceOwners.generateTokens(payload);

    await owner.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tokenlar muvaffaqiyatli yangilandi",
      accessToken: tokens.accessToken,
      owner: {
        id: owner.id,
        full_name: owner.full_name,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewOwner,
  findAllOwners,
  findOwnerById,
  deleteOwner,
  updateOwner,
  logIn,
  logOutOwner,
  refreshOwnertToken,
};
