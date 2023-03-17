require("dotenv").config();
const mongoose = require("mongoose");
const db = () => {
  return new Promise((resolve, reject) => {
    mongoose.set("strictQuery", false);
    // mongoose
    //   .connect(`mongodb://127.0.0.1:27017/user`, {
        let db=mongoose.connect(`${process.env.DB_HOST}://${process.env.DB_URL}/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((connection) => {
        resolve(connection);
      })
      .catch((err) => {
        console.log("error===============",err);
        reject(err);
      });
  });
};
module.exports = db;
