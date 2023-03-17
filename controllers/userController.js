require("dotenv").config();
const Config = require("../configuration/config");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(Config.cryptR.secret);
const userModel = require("../models/userModel");
const common = require("../shared/commonFunction");
const commonConstant = require("../shared/commonConstant");
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();
const globalLimit = 20;

function encryptPassword(password) {
  const salt = bcrypt.genSaltSync(1);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
UserLoginToken = (userData) => {
  return JWT.sign(
    {
      iss: "PracticeWork",
      sub: userData.id,
      name: userData.name,
      email: userData.email,
      phone:userData.phone,
      ag: userData.userAgent,
      iat: Math.round(new Date().getTime() / 1000),
      exp: Math.round(new Date().getTime() / 1000) + 24 * 60 * 60,
    },
    Config.jwt.secret
  );
};
module.exports = {
  addUser: async (req, res, next) => {
    try {
      const { name, email, phone, password } = req.body;
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const user = new userModel({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
      });
      const data =await user.save()
      if (Object.keys(data).length > 0) {
        res
          .status(201)
          .json({
            status: 1,
            message: "User created successfully.",
          })
          .end();
      } else {
        let returnErr = {
          status: 2,
          message: "User cann't be created",
        };
        res.status(400).json(returnErr).end();
      }
    } catch (err) {
      common.logError(err);
      res
        .status(400)
        .json({
          status: 3,
          message: commonConstant.errorText,
        })
        .end();
    }
  },
  handleLogin: async (req, res, next) => {
    if ( req.user._id !=null) {
      next();
    } else {
      const errData = { password: "Invalid login details" };
      return res.status(400).json({ status: 2, errors: errData });
    }
  },
  handleAuth: async (req, res, next) => {
    if (req.get("User-Agent") == req.user.ag) {
      if (req.user._id) {
        next();
      } else {
        let returnErr = { status: 5, message: "Unauthorized" };
        return res.status(401).json(returnErr);
      }
    } else {
      let returnErr = { status: 5, message: "Unauthorized" };
      return res.status(401).json(returnErr);
    }
  },
  userDetails: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const data = await userModel.findById({ _id: userId })
      if (Object.keys(data).length > 0) {
        res
          .status(200)
          .json({
            status: 1,
            data: data,
            message: "User data fetched successfuly",
          })
          .end();
      } 
      else {
        let returnErr = {
          status: 2,
          message: "User data can not be fetched",
        };
        res.status(400).json(returnErr).end();
      }
    } catch (err) {
      common.logError(err);
      res
        .status(400)
        .json({
          status: 3,
          message: commonConstant.errorText,
        })
        .end();
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const data = await userModel.deleteOne({ _id: userId })
      if (Object.keys(data).length > 0) {
        res
          .status(200)
          .json({
            status: 1,
            message: "User data has been deleted",
          })
          .end();
      } else {
        let returnErr = {
          status: 2,
          message: "User cann't be deleted",
        };
        res.status(400).json(returnErr).end();
      }
    } catch (err) {
      common.logError(err);
      res
        .status(400)
        .json({
          status: 3,
          message: commonConstant.errorText,
        })
        .end();
    }
  },
  allUsers: async (req, res, next) => {
    try {
      const data = await userModel.find()
      if (Object.keys(data).length > 0) {
        res
          .status(200)
          .json({
            status: 1,
            data: data,
            message: "All user data is here",
          })
          .end();
      } else {
        let returnErr = {
          status: 2,
          message: "User data cann't be showed",
        };
        res.status(400).json(returnErr).end();
      }
    } catch (err) {
      common.logError(err);
      res
        .status(400)
        .json({
          status: 3,
          message: commonConstant.errorText,
        })
        .end();
    }
  },
  updateuser: async (req, res, next) => {
    try {
      const { name, email, phone, password } = req.body;
      const data = await userModel.updateOne(
          { _id: req.params.userId },
          {
            name: name,
            email: email,
            phone: phone,
            password: bcrypt.hashSync(password, 10),
          }
        )
        if (Object.keys(data).length > 0) {
          res
            .status(200)
            .json({
              status: 1,
              data: data,
              message: "User data successfuly updated",
            })
            .end();
        } else {
          let returnErr = {
            status: 2,
            message: "User data cann't be updated",
          };
          res.status(400).json(returnErr).end();
        }
      } catch (err) {
        common.logError(err);
        res
          .status(400)
          .json({
            status: 3,
            message: commonConstant.errorText,
          })
          .end();
      }
    },
  userLogin: async (req, res, next) => {
    try {
      const { email } = req.body;
      let userDetails = {
        email: entities.encode(email),
      };
      const data = await userModel.findOne({ email: userDetails.email })
      if (Object.keys(data).length > 0) {
        let userData = {
          id: cryptr.encrypt(data.id),
          name: entities.encode(data.name),
          email: entities.encode(data.email),
          phone: entities.encode(data.phone),
          userAgent: cryptr.encrypt(req.get("User-Agent")),
        };
        const token = UserLoginToken(userData);
        res
          .status(200)
          .json({
            status: 1,
            token: token,
            message: "logged in",
          })
          .end();
      } else {
        let returnErr = {
          status: 2,
          message: "Failed to login",
        };
        res.status(400).json(returnErr).end();
      }
    } catch (err) {
      common.logError(err);
      res
        .status(400)
        .json({
          status: 3,
          message: commonConstant.errorText,
        })
        .end();
    }
  },
};
