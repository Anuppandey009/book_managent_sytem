const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const localStrategy = require("passport-local").Strategy;
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();
const Config = require("./configuration/config");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(Config.cryptR.secret);
const bcrypt = require("bcrypt");
const userModel = require("./models/userModel");
const BasicStrategy = require("passport-http").BasicStrategy;
const common=require("./shared/commonFunction")
const commonConstant=require("./shared/commonConstant")
isValidPassword = async function (newPassword, existingPassword) {
  try {
    const result = await bcrypt.compare(newPassword, existingPassword);
    return result;
  } catch (error) {
    common.logError(error);
    throw new Error(error);
  }
};
// passport.use(
//   "localUser",
//   new localStrategy(
//     {
//       usernameField: "email",
//     },
//     async (email, password, done) => {
//       try {
//         const user = await userModel.findOne({email:email})
        
//         if (Object.keys(user).length > 0) {
//           const isMatch = await isValidPassword(password, user.password);
//           if (!isMatch) {
//             return done(null, { id: 0 });
//           } else {
//             done(null, user);
//           }
//         } else {
//           return done(null, { id: 0 });
//         }
//       } catch (err) {
//         common.logError(err);
//         done(err, false);
//       }
//     }
//   )
// );

passport.use(
  "jwtUser",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.jwt.secret,
    },
    async (payload, done) => {
      try {
        if (!payload.sub) {
          return done(null, { id: 0 });
        }
        if (!payload.name) {
          return done(null, { id: 0 });
        }
        if (!payload.email) {
          return done(null, { id: 0 });
        }
        if (!payload.phone) {
          return done(null, { id: 0 });
        }
        if (!payload.ag) {
          return done(null, { id: 0 });
        }
        if (!payload.exp) {
          return done(null, { id: 0 });
        } else {
          const current_time = Math.round(new Date().getTime() / 1000);
          if (current_time > payload.exp) {
            return done(null, { id: 0 });
          }
        }
        const user = await userModel.findById(cryptr.decrypt(payload.sub));
        if (Object.keys(user).length > 0) {
          user.ag = cryptr.decrypt(payload.ag);
          done(null, user);
        } else {
          return done(null, { id: 0 });
        }
      } catch (err) {
        common.logError(err);
        done(err, false);
      }
    }
  )
);
  

passport.use(
  "localUser",
  new localStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({email:email})
        if (Object.keys(user).length > 0) {
  
          const isMatch = await isValidPassword(password, user.password);
          if (!isMatch) {
            return done(null, { id: 0 });
          } else {
            done(null, user);
          }
        }
        else {
          return done(null, { id: 0 });
        }
      } catch (err) {
        common.logError(err);
        done(null, err);
      }
    }
  )
);
