const router = require("express").Router();

router.use("/admins", require("./admins.routes"));
router.use("/owners", require("./owners.routes"));
router.use("/clients", require("./clients.routes"));
router.use("/products", require("./products.routes"));
router.use("/categories", require("./categories.routes"));
router.use("/contracts", require("./contracts.routes"));
router.use("/status", require("./status.routes"));
router.use("/payments", require("./payments.routes"));
router.use("/smart", require("./smart.req.routes"));

module.exports = router;
