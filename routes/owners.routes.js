const validate = require("../middleware/validate");
const {
  addNewOwner,
  findAllOwners,
  findOwnerById,
  deleteOwner,
  updateOwner,
  logIn,
  logOutOwner,
  refreshOwnertToken,
} = require("../controllers/owners.controller");
const { ownerSchema } = require("../validations/validations");

const authGuard = require("../middleware/guards/owner.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const adminGuard = require("../middleware/guards/admin.guard");
const router = require("express").Router();

router.post("/", validate(ownerSchema), addNewOwner);
router.post("/login", logIn);
router.get("/", adminGuard, userActiveGuard, findAllOwners);
router.get("/logout", logOutOwner);
router.get("/refreshtoken", refreshOwnertToken);
router.get("/:id", authGuard, userActiveGuard, authSelfGuard, findOwnerById);
router.delete("/:id", adminGuard, userActiveGuard, deleteOwner);
router.put(
  "/:id",
  validate(ownerSchema),
  authGuard,
  userActiveGuard,
  authSelfGuard,
  updateOwner
);

module.exports = router;
