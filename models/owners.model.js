const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Owners = sequelize.define(
  "owners",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
    },
    phone: {
      type: DataTypes.STRING(50),
    },
    address: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(30),
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Owners;
