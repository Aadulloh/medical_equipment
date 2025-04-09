const validate = require("../middleware/validate");
const {
  addNewClient,
  findAllClients,
  findClientById,
  deleteClient,
  updateClient,
  logIn,
  refreshClientToken,
  logOutClient,
} = require("../controllers/clients.controller");
const { clientSchema } = require("../validations/validations");

const clientGuard = require("../middleware/guards/client.guard");
const authSelfGuard = require("../middleware/guards/user.self.guard");
const userActiveGuard = require("../middleware/guards/user.active.guard");
const adminGuard = require("../middleware/guards/admin.guard");
const router = require("express").Router();

router.post("/", validate(clientSchema), addNewClient);
router.post("/login", logIn);
router.get("/", adminGuard, userActiveGuard, findAllClients);
router.get("/logout", logOutClient);
router.get("/refreshtoken", refreshClientToken);
router.get("/:id", clientGuard, userActiveGuard, authSelfGuard, findClientById);
router.delete("/:id", adminGuard, userActiveGuard, deleteClient);
router.put(
  "/:id",
  validate(clientSchema),
  clientGuard,
  userActiveGuard,
  authSelfGuard,
  updateClient
);

module.exports = router;
