const bcrypt = require("bcryptjs");
const config = require("config");
const jwtService = require("../services/jwtService");
const Admins = require("../models/admins.model");
const Owners = require("../models/owners.model");
const Clients = require("../models/clients.model");
const { errorHandler } = require("../helpers/error_handler");
const mailService = require("../services/mail.service");

const getModelByRole = (role) => {
  switch (role) {
    case "admin":
      return Admins;
    case "owner":
      return Owners;
    case "client":
      return Clients;
    default:
      return null;
  }
};

const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role, phone, address, passport } =
      req.body;
    const model = getModelByRole(role);
    if (!model) return res.status(400).send({ message: "Noto‘g‘ri role" });

    const existing = await model.findOne({ where: { email } });
    if (existing)
      return res.status(400).send({ message: "Email allaqachon mavjud" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userData = {
      full_name,
      email,
      password: hashedPassword,
      ...(phone && { phone }),
      ...(address && { address }),
      ...(passport && { passport }),
    };

    await model.create(userData);
    res.status(201).send({ message: "Ro'yxatdan muvaffaqiyatli o'tdi" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const model = getModelByRole(role);
    if (!model) return res.status(400).send({ message: "Notogri role" });

    const user = await model.findOne({ where: { email } });
    if (!user)
      return res.status(400).send({ message: "Email yoki password notogri" });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki password notogri" });

    const payload = { id: user.id, email: user.email, role };
    const tokens = jwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    user.is_active = true;
    await mailService.sendActivationMail(newClient.email);
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    errorHandler(err, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    let user;
    for (const model of [Admins, Owners, Clients]) {
      user = await model.findOne({ where: { refresh_token: refreshToken } });
      if (user) break;
    }

    if (!user) {
      return res
        .status(400)
        .send({ message: "Tokenli foydalanuvchi topilmadi" });
    }

    user.refresh_token = "";
    await user.save();
    res.clearCookie("refreshToken");
    res.send({ message: "Tizimdan chiqildi" });
  } catch (err) {
    errorHandler(err, res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).send({ message: "Refresh token mavjud emas" });

    const payload = await jwtService.verifyRefreshToken(refreshToken);
    const model = getModelByRole(payload.role);
    const user = await model.findOne({
      where: { id: payload.id, refresh_token: refreshToken },
    });

    if (!user)
      return res.status(400).send({ message: "Token notogri yoki eskirgan" });

    const newPayload = { id: user.id, email: user.email, role: payload.role };
    const tokens = jwtService.generateTokens(newPayload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.send({ accessToken: tokens.accessToken });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};
