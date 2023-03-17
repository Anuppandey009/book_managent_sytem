const express = require("express");
const userRouter = require("./userRouter");
const bookRouter = require("./bookRouter");

const router = express.Router();
const defaultRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/book",
    route: bookRouter,
  },
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
module.exports = router;
