const router = require("express").Router();
const { addSubscriber } = require("../../db/index");

router.post("/", async (req, res, next) => {
  const { name, email } = req.body;
  try {
    await addSubscriber(name, email);
    return res.json({ message: `successfully subscribed to ${name} service` });
  } catch (err) {
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ message: `service ${name} does not exist` });
    }
    return next(err);
  }
});

module.exports = router;
