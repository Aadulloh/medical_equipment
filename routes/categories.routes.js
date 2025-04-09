const validate = require("../middleware/validate");
const {
  addNewCategory,
  findAllCategories,
  findCategoryById,
  deleteCategory,
  updateCategory,
} = require("../controllers/categories.controller");
const { categorySchema } = require("../validations/validations");

const authGuard = require("../middleware/guards/admin.guard");
const roleGuard = require("../middleware/guards/role.guard");
const router = require("express").Router();

router.post(
  "/",
  validate(categorySchema),
  authGuard,
  roleGuard(["admin"]),
  addNewCategory
);
router.get("/", authGuard, findAllCategories);
router.get("/:id", authGuard, findCategoryById);
router.delete("/:id", authGuard, roleGuard(["admin"]), deleteCategory);
router.put(
  "/:id",
  authGuard,
  roleGuard(["admin"]),
  validate(categorySchema),
  updateCategory
);

module.exports = router;
