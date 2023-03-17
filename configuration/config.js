require("dotenv").config();
const config = {
  jwt: {
    secret: process.env.SECRET,
  },
  cryptR: {
    secret: process.env.ENC_KEY,
  },
  time: {
    time_zone: process.env.TIME_ZONE,
  }
};
// console.log("config.db>>>", config.db);
module.exports = config;
