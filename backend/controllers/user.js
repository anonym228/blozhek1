const {
  registerValidation,
  authValidation,
  tokenValidate
} = require("../helpers/validate");
const User = require("../model/User");
const Token = require("../model/Token");
const bcrypt = require("bcrypt");

require("dotenv").config();
const {
  generateRefreshToken,
  generateAccessToken,
  addNewRefreshTokenToDb
} = require("../helpers/tokens");

async function updateToken(userId) {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  const data = await addNewRefreshTokenToDb(refreshToken.id, userId);
  if (data) {
    return {
      accessToken: accessToken,
      refreshToken: refreshToken.refreshToken
    };
  }
  return false;
}

async function registerUser(req, res) {
  const { error } = registerValidation(req.body);
  const { username, password } = req.body;

  if (error) {
    return res.send({
      status: false,
      message: error.details[0].message
    });
  }

  try {
    const isUsernameTaken = await User.findOne({ username });
    if (isUsernameTaken) {
      return res.send({
        status: false,
        message: "User data already taken!"
      });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);

    let newUser = new User({
      username,
      password: hash
    });

    await newUser.save();

    const data = await updateToken(newUser._id);
    res.send({
      status: true,
      message: data
    });
  } catch (error) {
    return res.send({
      status: "catch",
      message: error
    });
  }
}

async function auth(req, res) {
  const { username, password } = req.body;
  const { error } = authValidation(req.body);
  if (error) {
    return res.send({
      status: false,
      message: error.details[0].message
    });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const data = await updateToken(user._id);
        res.send({
          status: true,
          message: data
        });
      } else {
        return res.send({
          status: false,
          message: "Invalid password!"
        });
      }
    } else {
      return res.send({
        status: false,
        message: "User not found!"
      });
    }
  } catch (error) {}
}

async function refreshTokens(req, res) {
  const { refreshToken } = req.body;
  let data = {
    token: refreshToken,
    secret: process.env.token_secret,
    type: "refresh"
  };

  const result = tokenValidate(data);
  if (result.status) {
    const token = await Token.findOne({ tokenId: result.message.id });
    if (token === null) {
      res.send({
        status: false,
        message: "Invalid token!"
      });
    }

    const data = await updateToken(token.userId);
    res.send({
      data
    });
  } else {
    res.send({
      status: result.status,
      message: result.message
    });
  }
}

module.exports = {
  registerUser,
  auth,
  refreshTokens
};
