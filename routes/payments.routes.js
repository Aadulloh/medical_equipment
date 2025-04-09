const validate = require("../middleware/validate");
const {
  addNewPayment,
  findAllPayments,
  findPaymentById,
  deletePayment,
  updatePayment,
} = require("../controllers/payments.controller");
const { paymentSchema } = require("../validations/validations");

const adminGuard = require("../middleware/guards/admin.guard");
const roleGuard = require("../middleware/guards/role.guard");
const clientGuard = require("../middleware/guards/client.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");
const router = require("express").Router();

router.post(
  "/",
  validate(paymentSchema),
  clientGuard,
  userActiveGuard,
  roleGuard(["user"]),
  addNewPayment
);
router.get(
  "/",
  adminGuard,
  userActiveGuard,
  roleGuard("admin"),
  findAllPayments
);

router.get(
  "/:id",
  clientGuard,
  userActiveGuard,
  authSelfGuard,
  findPaymentById
);
router.delete(
  "/:id",
  adminGuard,
  userActiveGuard,
  roleGuard("admin"),
  deletePayment
);
router.put(
  "/:id",
  validate(paymentSchema),
  adminGuard,
  userActiveGuard,
  roleGuard("admin"),
  updatePayment
);

module.exports = router;
