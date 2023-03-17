const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const common=require("../shared/commonFunction")
const commonConstant=require("../shared/commonConstant")

const isValidPassword = async function (newPassword, existingPassword) {
  try {
    const result = await bcrypt.compare(newPassword, existingPassword);
    return result;
  } catch (err) {
    console.log("error============",err);
  }
};

module.exports = {
  checkExistingUser: async (req, res, next) => {
    try {
      const userEmail = req.body.email;
      const data = await userModel.find({ email: userEmail })
        if (data.length > 0) {
          res.status(400).json({
            status: 2,
            message: "Email already used",
          });
        } else {
          const userPhone = req.body.phone;
          const data = await userModel.find({ phone: userPhone })
          if (data.length > 0) {
          res.status(400).json({
            status: 2,
            message: "Phone No already used",
          });
        } else {
          next();
        }
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
  userCredentials: async (req, res, next) => {
    try {
      if( req.user=='TypeError: Cannot convert undefined or null to object'){
        return res.status(400).json({
          message:"Please give the credentials in proper format"
        })

       }
      const { email, password } = req.body;
      const userDetails = await userModel.findOne({ email: email });
      let error = "Wrong Email";
        if (Object.keys(userDetails).length > 0) {
          const isMatch = await isValidPassword(
            password,
            req.user.password
          );
          
          if (!isMatch) {
            error = "Please give the credentials properly";
            let returnErr = { status: 2, errors: error };
            return res.status(400).json(returnErr);
          } else if (isMatch) {
            next();
          }
        } else {
          error = "no data";
          let returnErr = { status: 3, errors: error };
          return res.status(400).json(returnErr);
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
  // checkPhoneExist: async (req, res, next) => {
  //   try {
  //     const userPhone = req.body.phone;
  //     const data = await userModel.find({ phone: userPhone })
  //       if (data.length > 0) {
  //         res.status(400).json({
  //           status: 2,
  //           message: "Phone No already used",
  //         });
  //       } else {
  //         next();
  //       }
  //   } catch (err) {
  //     common.logError(err);
  //     res
  //       .status(400)
  //       .json({
  //         status: 3,
  //         message: commonConstant.errorText,
  //       })
  //       .end();
  //   }
  // },
  checkIdExist: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const data = await userModel.find({ _id: userId })
        if (data.length == 0) {
          res.status(400).json({
            status: 2,
            message: "Id doesn't exist",
          })
        } else {
          next();
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
}
