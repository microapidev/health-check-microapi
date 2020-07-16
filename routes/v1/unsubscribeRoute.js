const router = require("express").Router();
const { removeSubscriber } = require("../../db/index");

router.post("/", async (req, res, next) => {
  const { name, email } = req.body;
  try {
    await removeSubscriber(name, email);
    return res.json({
      message: `successfully unsubscribed from ${name} service`,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
