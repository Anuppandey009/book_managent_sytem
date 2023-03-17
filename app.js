require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const passport = require("passport");
const helmet = require("helmet");
const logger = require("morgan");
const routes = require("./routes/index");
const Config = require("./configuration/config");
const app = express();
const session = require("express-session");
const cors = require("cors");
const db = require("./configuration/dbConn");
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(helmet.noSniff());
app.use(
  session({
    secret: Config.cryptR.secret,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(helmet.xssFilter());
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));

app.get("/", async (req, res) => {
  return res.send({
    success: true,
    message: "Welcome to the home page",
  });
});

app.use("/api/v1", apiLimiter, routes);

app.use(function (req, res, next) {
  console.log("Invalid URL");
  next(createError(404));
});
db()
  .then(() => {
    app.listen(process.env.APP_PORT, () => {
      console.log(`App is listening the port:`, process.env.APP_PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB is not connected");
  });


  module.exports = app