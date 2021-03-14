const axios = require("axios");
const https = require("https");

const getUserFromRouter = async () => {
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  try {
    const res = await instance.get("https://196.216.73.167/rest/user", {
      auth: { username: "1admin", password: "Kipese@!!!" },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error.response);
    // console.error(error.response);
    return error.console;
  }
};

getUserFromRouter();
