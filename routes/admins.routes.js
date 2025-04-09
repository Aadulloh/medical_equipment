const validate = require("../middleware/validate");
const {
  addNewAdmin,
  findAllAdmins,
  findAdminById,
  deleteAdmin,
  updateAdmin,
  refreshAdmintToken,
  logIn,
  logOutAdmin,
} = require("../controllers/admins.controller");
const { adminSchema } = require("../validations/validations");

const authGuard = require("../middleware/guards/admin.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const roleGuard = require("../middleware/guards/role.guard");
const router = require("express").Router();

router.post("/", validate(adminSchema), addNewAdmin);
router.post("/login", logIn);
router.get("/", authGuard, roleGuard(["admin"]), findAllAdmins);
router.get("/logout", logOutAdmin);
router.get("/refreshtoken", refreshAdmintToken);
router.get("/:id", authGuard, userActiveGuard, authSelfGuard, findAdminById);
router.delete("/:id", authGuard, roleGuard(["admin"]), deleteAdmin);
router.put(
  "/:id",
  validate(adminSchema),
  authGuard,
  authSelfGuard,
  updateAdmin
);

module.exports = router;
