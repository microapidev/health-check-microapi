const router = require("express").Router();
const {
  getAllServices,
  addNewService,
  getSubscribedServices,
} = require("../../db/index");
const getApiStatus = require("../../domain/getApiStatus");

let mainLoop;

router.get("/", async (req, res, next) => {
  try {
    let allServices;
    if (req.query.subscriber) {
      allServices = await getSubscribedServices(req.query.subscriber);
    } else {
      allServices = await getAllServices();
    }
    return res.status(200).json(
      allServices.rows.map((service) => ({
        name: service.service_name,
        url: service.service_url,
        status: service.service_status,
      }))
    );
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, url } = req.body;
    const status = await getApiStatus(url);
    await addNewService(name, url, status);
    mainLoop.addOne({
      service_name: name,
      service_url: url,
      service_status: status,
    });
    return res.status(200).json({ message: "service successfully added" });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({
        message: `service already exist, please choose a different name`,
      });
    }
    return next(err);
  }
});

module.exports = (appLoop) => {
  mainLoop = appLoop;
  return router;
};
