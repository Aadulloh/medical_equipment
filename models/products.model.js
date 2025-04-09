const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Categories = require("./categories.model");
const Owners = require("./owners.model");

const Products = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

Products.belongsTo(Categories);
Categories.hasMany(Products);

Products.belongsTo(Owners);
Owners.hasMany(Products);

module.exports = Products;
