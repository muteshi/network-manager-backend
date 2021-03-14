const axios = require("axios");

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Check if user is admin user in router
const checkUser = (url, username, password) => {
  return instance.get(`https://${url}/rest/user`, {
    auth: { username, password },
  });
};

module.exports = { checkUser };
