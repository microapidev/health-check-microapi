/*const { Pool } = require("pg");

const nodeEnv = process.env.NODE_ENV;

const connectionString =
  nodeEnv === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

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
*/
const addNewService = (name, url) => undefined;
const getAllServices = () => [
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

const updateServiceStatus = (name) => undefined;
const addSubscriber = (name, email) => undefined;
const getAllSubscribers = (name) => [
  `${name}-subscriber-1`,
  `${name}-subscriber-2`,
  `${name}-subscriber-3`,
];
const removeSubscriber = (name, email) => undefined;

module.exports = {
  addNewService,
  getAllServices,
  updateServiceStatus,
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
};
