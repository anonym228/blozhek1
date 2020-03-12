const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const registerValidation = data => {
  const schema = Joi.object({
    username: Joi.string()
      .min(1)
      .required(),
    password: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate(data);
};

const authValidation = data => {
  const schema = Joi.object({
    username: Joi.string()
      .min(1)
      .required(),
    password: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate(data);
};

// function tokenValidate(data) {
//   try {
//     let payload;
//     if (data.token && data.token.trim() !== "") {
//       payload = jwt.verify(data.token, data.secret);
//       if (payload.type !== data.type) {
//         return {
//           status: false,
//           message: "Invalid token!"
//         };
//       }
//       return {
//         status: true,
//         payload: payload
//       };
//     }
//   } catch (e) {}
// }

const tokenValidate = data => {
  let payload;
  try {
    if (data.token && data.token.trim() !== "") {
      payload = jwt.verify(data.token, data.secret);
      if (payload.type !== data.type) {
        return {
          status: false,
          message: "Invalid token!"
        };
      }
    } else {
      return {
        status: false,
        message: "Invalid token!"
      };
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        status: false,
        message: "Token was expired!"
      };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return {
        status: false,
        message: "Invalid token!"
      };
    }
  }
  return {
    status: true,
    message: payload
  };
};

module.exports = {
  registerValidation,
  authValidation,
  tokenValidate
};
