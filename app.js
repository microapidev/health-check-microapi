const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const serviceRoute = require("./routes/v1/serviceRoute");
const subscribeRoute = require("./routes/v1/subscribeRoute");
const unsubscribeRoute = require("./routes/v1/unsubscribeRoute");

const RequestLoop = require("./domain/requestQueue");
const { getAllServices, updateServiceStatus } = require("./db/index");

getAllServices()
  .then((allServices) => {
    const mainLoop = new RequestLoop(allServices.rows, updateServiceStatus);
    mainLoop.start();
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use("/api/v1/services", serviceRoute(mainLoop));
    app.use("/api/v1/subscribe", subscribeRoute);
    app.use("/api/v1/unsubscribe", unsubscribeRoute);
    app.use(
      "/api/v1/documentation",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    app.use("/", express.static("home"));

    app.use((req, res, next) =>
      res.status(404).json({
        status: "error",
        error: "the requested resource was not found",
      })
    );

    app.use((err, req, res, next) =>
      res.status(500).json({
        status: "error",
        error:
          process.NODE_ENV === "production"
            ? "an error occured processing your request"
            : err,
      })
    );

    const PORT = process.env.PORT || 3100;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
//module.exports = app;
