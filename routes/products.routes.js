const validate = require("../middleware/validate");
const {
  addNewProduct,
  findAllProducts,
  findProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/products.controller");
const { productSchema } = require("../validations/validations");

const adminGuard = require("../middleware/guards/admin.guard");
const ownerGuard = require("../middleware/guards/owner.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const router = require("express").Router();

router.post(
  "/",
  validate(productSchema),
  ownerGuard,
  userActiveGuard,
  addNewProduct
);
router.get("/", findAllProducts);
router.get("/:id", ownerGuard, userActiveGuard, findProductById);
router.delete("/:id", validate(productSchema), deleteProduct);
router.put(
  "/:id",
  validate(productSchema),
  ownerGuard,
  userActiveGuard,
  updateProduct
);

router.put(
  "/admin/:id",
  validate(productSchema),
  adminGuard,
  userActiveGuard,
  updateProduct
);

module.exports = router;
