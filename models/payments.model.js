const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Contracts = require("./contracts.model");

const Payments = sequelize.define(
  "payments",
  {
    emount: {
      type: DataTypes.BIGINT,
    },
    payment_date: {
      type: DataTypes.DATE,
    },
    payment_method: {
      type: DataTypes.ENUM("cash", "card", "transfer"),
    },
  },
  {
    freezeTableName: true,
  }
);

Payments.belongsTo(Contracts);
Contracts.hasMany(Payments);

module.exports = Payments;
