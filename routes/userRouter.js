const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../passport");
const userController = require("../controllers/userController");
const {
    validateBody,
    validateParam,
    schemas
  } = require("../helpers/userValidate");
const validateDbBody = require("../helpers/userDbValidate");
const passportSignIn = passport.authenticate("localUser", {
  session: false,
});
const userPassportJWT = passport.authenticate("jwtUser", { session: false });

router
  .route("/addUsers")
  .post(
    validateBody(schemas.validateDetails),
    validateDbBody.checkExistingUser,
    userController.addUser
  );
router
  .route("/login")
  .post(
    validateBody(schemas.validateLogin),
    passportSignIn,
    validateDbBody.userCredentials,
    userController.handleLogin,
    userController.userLogin
  );
router
  .route("/userDetails/:userId")
  .get(
    userPassportJWT,
    userController.handleAuth,
    validateParam(schemas.userId),
    validateDbBody.checkIdExist, 
    userController.userDetails
  );
router
  .route("/allUsersDetails")
  .get(
    userPassportJWT,
    userController.handleAuth,
    userController.allUsers
  );
router
  .route("/deleteUser/:userId")
  .delete(
    userPassportJWT,
    userController.handleAuth,
    validateParam(schemas.userId),
    validateDbBody.checkIdExist, 
    userController.deleteUser
  );

router
  .route("/updateuser/:userId")
  .put(
    userPassportJWT,
    userController.handleAuth,
    validateBody(schemas.validateDetails),
    validateParam(schemas.userId),
    validateDbBody.checkIdExist, 
    validateDbBody.checkExistingUser,
    userController.updateuser
  );

module.exports = router;
