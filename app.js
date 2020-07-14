const express = require("express");
const cors = require("cors");

const serviceRoute = require("./routes/v1/serviceRoute");
//const subscribeRoute = require("./routes/v1/subscribeRoute");
//const unsubscribeRoute = require("./routes/v1/unsubscribeRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1/services", serviceRoute);
//app.use("/api/v1/subscribe", subscribeRoute);
//app.use("/api/v1/unsubscribe", unsubscribeRoute);

app.use((req, res, next) =>
  res
    .status(404)
    .json({ status: "error", error: "the requested resource was not found" })
);

app.use((err, req, res, next) =>
  res.status(500).json({
    status: "error",
    error: "An error occured processing your request",
  })
);

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
