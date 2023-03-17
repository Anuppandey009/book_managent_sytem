const Joi = require("joi");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        let errMsg = {};
        for (let counter in error.details) {
          let k = error.details[counter].context.key;
          let val = error.details[counter].message;
          errMsg[k] = val;
        }
        let returnErr = { status: 2, errors: errMsg };
        return res.status(400).json(returnErr);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = value;
      next();
    };
  },
  validateParam: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.params);
      if (result.error) {
        let return_err = { status: 2, errors: "Invalid argument" };
        return res.status(400).json(return_err);
      }

      if (!req.value) {
        req.value = {};
      }
      req.value["params"] = result.value;
      next();
    };
  },
  schemas: {
    validateDetails: Joi.object().keys({
        name: Joi.string()
          .required()
          .min(3)
          .regex(/^[A-Za-z]*$/, "Only alphabet allowed")
          .max(30),
        email: Joi.string().required().email().max(80),
        phone: Joi.string()
        .required()
        .regex(
          /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
          "Phone number must have 10 digits"
        ),
        password: Joi.string()
          .required()
          .min(8)
          .max(20)
      }),
    validateLogin: Joi.object().keys({
      email: Joi.string().required().email().max(80),
      password: Joi.string()
        .required()
        .min(8)
        .max(20)
    }),
    userId: Joi.object().keys({
      userId: Joi.string().required().min(1),
    }),
  },
};
