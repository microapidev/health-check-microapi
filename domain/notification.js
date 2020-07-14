const { getAllSubscribers } = require("../db/index");

const sendNotification = async (message, serviceName) => {
  const receipients = await getAllSubscribers(serviceName);
  receipients.forEach((receipient) =>
    console.log(`sending ${message} to ${receipient}`)
  );
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
