const config = require("config");
const { errorHandler } = require("../helpers/error_handler");
const Admins = require("../models/admins.model");
const mailService = require("../services/mail.service");
const bcrypt = require("bcrypt");
const jwtServiceAdmins = require("../services/jwtadmins.service");

const addNewAdmin = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 7);

    const newAdmin = await Admins.create({
      full_name,
      email,
      password: hashedPassword,
    });

    res.status(201).send({ message: "Yangi Admin qo'shildi", newAdmin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllAdmins = async (req, res) => {
  try {
    const adminsList = await Admins.findAll();

    res.status(200).send({
      message: "Adminlar ro'yxati",
      adminsList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findByPk(id);

    if (!admin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    res.status(200).send({ message: "Admin topildi", admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admins.findByPk(id);

    if (!admin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    await admin.destroy();

    res.status(200).send({ message: "Admin o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 7);

    const admin = await Admins.findByPk(id);

    if (!admin) {
      return res.status(404).send({ message: "Admin topilmadi" });
    }

    await admin.update({ full_name, email, password: hashedPassword });

    res.status(200).send({
      message: "Admin yangilandi",
      admin,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admins.findOne({ where: { email } });
    if (!admin) {
      return res.status(400).send({ message: "Email yoki parol xato !" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki parol xato !" });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      role: "admin",
      is_active: admin.is_active,
    };

    const token = jwtServiceAdmins.generateTokens(payload);

    await admin.update({ refresh_token: token.refreshToken });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    admin.is_active = true;
    await admin.save();
    await mailService.sendActivationMail(admin.email, admin.full_name);

    res.status(200).send({
      message: "Tizimga xush kelibsiz !",
      accessToken: token.accessToken,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logOutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Cookie-da refresh token topilmadi!",
      });
    }

    const admin = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!admin) {
      return res.status(404).json({
        message: "Bunday token bilan Admin topilmadi!",
      });
    }

    admin.refresh_token = null;
    admin.is_active = false;
    await admin.save();

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Admin muvaffaqiyatli tizimdan chiqdi",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshAdmintToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Avval tizimga kirishingiz kerak !",
      });
    }

    const decodedToken = await jwtServiceAdmins.verifyRefreshToken(
      refreshToken
    );
    if (!decodedToken) {
      return res.status(403).json({
        success: false,
        message: "Yaroqsiz token",
      });
    }

    const admin = await Admins.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi yoki avval tizimdan chiqib bo'lingan",
      });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      role: "admin",
      is_active: admin.is_active,
    };

    const tokens = jwtServiceAdmins.generateTokens(payload);

    await admin.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tokenlar muvaffaqiyatli yangilandi",
      accessToken: tokens.accessToken,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewAdmin,
  findAllAdmins,
  findAdminById,
  deleteAdmin,
  updateAdmin,
  logIn,
  logOutAdmin,
  refreshAdmintToken,
};
