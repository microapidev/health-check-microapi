const fetch = require("node-fetch");

module.exports = async (url) => {
  try {
    let res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
};
