const { getAllSubscribers } = require("../db/index");
const { send } = require("./mail");

const sendNotification = async (message, serviceName) => {
  try {
    const receipients = await getAllSubscribers(serviceName);
    receipients.rows.forEach((receipient) => {
      console.log(`sending ${message} to ${receipient.subscriber_email}`);
      send(
        message,
        receipient.subscriber_email,
        "Health Notification",
        "API Healthcheck"
      );
    });
  } catch (err) {
    console.log(err);
  }
};

const sendNotUpNotification = (name) =>
  sendNotification(`The service ${name} is not up`, name);
const sendUpNotification = (name) =>
  sendNotification(`The service ${name} is up`, name);
const sendDownNotification = (name) =>
  sendNotification(`The service ${name} is down`, name);

module.exports = {
  sendNotUpNotification,
  sendUpNotification,
  sendDownNotification,
};
