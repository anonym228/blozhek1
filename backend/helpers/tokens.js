require("dotenv").config();
const { tokens } = require("../config");
const jwt = require("jsonwebtoken");
const uuid = require("uuid/v4");
const Token = require("../model/Token");

function generateAccessToken(userId) {
  return jwt.sign(
    { userId, type: tokens.accessToken.type },
    process.env.token_secret,
    {
      expiresIn: tokens.accessToken.expiresIn
    }
  );
}

function generateRefreshToken() {
  const payload = {
    id: uuid(),
    type: tokens.refreshToken.type
  };

  return {
    id: payload.id,
    refreshToken: jwt.sign(payload, process.env.token_secret, {
      expiresIn: tokens.refreshToken.expiresIn
    })
  };
}

function addNewRefreshTokenToDb(tokenId, userId) {
  return Token.findOneAndRemove({ userId })
    .exec()
    .then(() => Token.create({ tokenId, userId }));
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  addNewRefreshTokenToDb
};
