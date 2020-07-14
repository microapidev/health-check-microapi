const router = require("express").Router();
const { getAllServices } = require("../../db/index");
//const { addNewService, updateService } = require("../controllers/service");

//router.post("/", addNewService);
//router.patch("/", updateService);
router.get("/", (req, res, next) => {
  const allServices = getAllServices();
  return res.status(200).json(allServices);
});
module.exports = router;
