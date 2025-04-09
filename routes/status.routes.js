const validate = require("../middleware/validate");
const {
  addNewStatus,
  findAllStatus,
  findStatusById,
  deleteStatus,
  updateStatus,
} = require("../controllers/status.controller");
const { statusSchema } = require("../validations/validations");

const adminGuard = require("../middleware/guards/admin.guard");
const ownerGuard = require("../middleware/guards/owner.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const router = require("express").Router();

router.post(
  "/",
  validate(statusSchema),
  ownerGuard,
  userActiveGuard,
  addNewStatus
);
router.get("/", ownerGuard, userActiveGuard, findAllStatus);
router.get("/:id", ownerGuard, userActiveGuard, findStatusById);
router.delete("/:id", ownerGuard, userActiveGuard, deleteStatus);
router.put(
  "/:id",
  validate(statusSchema),
  ownerGuard,
  userActiveGuard,
  updateStatus
);

//admin

router.post(
  "/admin",
  validate(statusSchema),
  adminGuard,
  userActiveGuard,
  addNewStatus
);
router.get("admin/", adminGuard, userActiveGuard, findAllStatus);
router.get("/admin/:id", adminGuard, userActiveGuard, findStatusById);
router.delete("/admin/:id", adminGuard, userActiveGuard, deleteStatus);
router.put(
  "/admin/:id",
  validate(statusSchema),
  adminGuard,
  userActiveGuard,
  updateStatus
);

module.exports = router;
