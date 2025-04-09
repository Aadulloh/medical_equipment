const { errorHandler } = require("../helpers/error_handler");
const Categories = require("../models/categories.model");
const Products = require("../models/products.model");

const addNewCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = await Categories.create({
      name,
      description,
    });

    res.status(201).send({ message: "Yangi Category qo'shildi", newCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAllCategories = async (req, res) => {
  try {
    const categorysList = await Categories.findAll({
      include: [Products],
    });

    res.status(200).send({
      message: "Categorylar ro'yxati",
      categorysList,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).send({ message: "Category topilmadi" });
    }

    res.status(200).send({ message: "Category topildi", category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).send({ message: "Category topilmadi" });
    }

    await category.destroy();

    res.status(200).send({ message: "Category o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).send({ message: "Category topilmadi" });
    }

    await category.update({ name, description });

    res.status(200).send({
      message: "Category yangilandi",
      category,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewCategory,
  findAllCategories,
  findCategoryById,
  deleteCategory,
  updateCategory,
};
