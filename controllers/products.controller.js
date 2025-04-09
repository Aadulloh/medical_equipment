const { errorHandler } = require("../helpers/error_handler");
const Categories = require("../models/categories.model");
const Owners = require("../models/owners.model");
const Products = require("../models/products.model");

const addNewProduct = async (req, res) => {
  try {
    const { name, categoryId, ownerId, description } = req.body;

    const newProduct = await Products.create({
      name,
      categoryId,
      ownerId,
      description,
    });

    res.status(201).send({ message: "Yangi Product qo'shildi", newProduct });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllProducts = async (req, res) => {
  try {
    const productsList = await Products.findAll({
      include: [Categories, Owners],
    });

    res.status(200).send({
      message: "Productlar ro'yxati",
      productsList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).send({ message: "Product topilmadi" });
    }

    res.status(200).send({ message: "Product topildi", product });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).send({ message: "Product topilmadi" });
    }

    await product.destroy();

    res.status(200).send({ message: "Product o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId, ownerId, description } = req.body;

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).send({ message: "Product topilmadi" });
    }

    await product.update({ name, categoryId, ownerId, description });

    res.status(200).send({
      message: "Product yangilandi",
      product,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewProduct,
  findAllProducts,
  findProductById,
  deleteProduct,
  updateProduct,
};
