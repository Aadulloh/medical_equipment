const {
  getRentedProductsByDateRange,
  getClientsWithDamageReport,
  getCancelledClients,
  getTopOwnersByCategory,
  getClientPaymentsInfo,
} = require("../controllers/smart.request.controller");

const router = require("express").Router();

router.post("/rented-products", getRentedProductsByDateRange);
router.post("/demage-report", getClientsWithDamageReport);
router.post("/canceled-client", getCancelledClients);
router.get("/owner/:categoryId", getTopOwnersByCategory);
router.post("/clients-info", getClientPaymentsInfo);

module.exports = router;
