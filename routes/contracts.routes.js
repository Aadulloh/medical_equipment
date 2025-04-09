const validate = require("../middleware/validate");
const {
  addNewContract,
  findAllContracts,
  findContractById,
  deleteContract,
  updateContract,
} = require("../controllers/contracts.controller");
const { contractSchema } = require("../validations/validations");

const adminGuard = require("../middleware/guards/admin.guard");
const roleGuard = require("../middleware/guards/role.guard");
const clientGuard = require("../middleware/guards/client.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");

const router = require("express").Router();

router.post(
  "/",
  validate(contractSchema),
  clientGuard,
  userActiveGuard,
  roleGuard(["user"]),
  addNewContract
);
router.get(
  "/",
  adminGuard,
  userActiveGuard,
  roleGuard("admin"),
  findAllContracts
);

router.get(
  "/:id",
  clientGuard,
  userActiveGuard,
  authSelfGuard,
  findContractById
);
router.delete(
  "/:id",
  adminGuard,
  userActiveGuard,
  roleGuard("admin"),
  deleteContract
);
router.put(
  "/:id",
  adminGuard,
  userActiveGuard,
  roleGuard("admin"),
  validate(contractSchema),
  updateContract
);

module.exports = router;
