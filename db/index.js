require("dotenv").config();
const { Pool } = require("pg");

const nodeEnv = process.env.NODE_ENV;

const connectionString =
  nodeEnv === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

console.log(connectionString);

const pool = new Pool({
  connectionString,
});

pool.on("connect", () => {
  console.log(
    `successfully connected to ${
      nodeEnv === "test" ? "test" : "production"
    } database`
  );
});

const addNewService = (name, url, status) =>
  pool.query(
    "INSERT INTO services(service_name, service_url, service_status) VALUES($1, $2, $3)",
    [name, url, status]
  );

const getAllServices = () => pool.query("SELECT * from services");
const getSubscribedServices = (email) =>
  pool.query(
    "SELECT * FROM services JOIN subscriptions ON services.service_name=subscriptions.service_name where subscriber_email=$1",
    [email]
  );
/*
[
  { name: "comment", url: "https://comment.microapi.dev/health", status: 0 },
  { name: "auth", url: "https://auth.microapi.dev/health", status: 0 },
  {
    name: "usermanagement",
    url: "https://usermanagement.microapi.dev/health",
    status: 0,
  },
  {
    name: "spreadsheet",
    url: "https://spreadsheet.microapi.dev/health",
    status: 0,
  },
];
*/
const updateServiceStatus = (name, status) =>
  pool.query("UPDATE services SET service_status=$1 WHERE service_name=$2", [
    status,
    name,
  ]);

const addSubscriber = (name, email) =>
  pool.query(
    "INSERT INTO subscriptions(subscriber_email, service_name) VALUES($1, $2)",
    [email, name]
  );
const getAllSubscribers = (name) =>
  pool.query(
    "SELECT subscriber_email FROM subscriptions WHERE service_name=$1",
    [name]
  );
/*
  [
  `${name}-subscriber-1`,
  `${name}-subscriber-2`,
  `${name}-subscriber-3`,
];
*/
const removeSubscriber = (name, email) =>
  pool.query(
    "DELETE FROM subscriptions WHERE service_name=$1 AND subscriber_email=$2",
    [name, email]
  );

module.exports = {
  addNewService,
  getAllServices,
  updateServiceStatus,
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
  getSubscribedServices,
};
