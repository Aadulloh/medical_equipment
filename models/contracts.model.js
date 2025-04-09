const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Clients = require("./clients.model");
const Products = require("./products.model");
const Status = require("./status.model");

const Contracts = sequelize.define(
  "contracts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    demage_report: {
      type: DataTypes.STRING(255),
    },
  },
  {
    freezeTableName: true,
  }
);

Contracts.belongsTo(Clients);
Clients.hasMany(Contracts);

Contracts.belongsTo(Products);
Products.hasMany(Contracts);

Contracts.belongsTo(Status);
Status.hasMany(Contracts);

module.exports = Contracts;
