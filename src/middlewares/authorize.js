const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto-js');
const authService = require('../services/auth.service');
// const APIError = require('../utils/APIError');

dotenv.config();

const authorize = () => async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'You must be logged In' });
  }
  const token = await authorization.replace('Bearer ', '');
  // verify token
  let payload = false;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Bad Token' });
  }
  if (!payload) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'You must be logged In' });
  }
  // verify session
  const user = await authService.getUserById(payload.id);
  if (user.activeToken === null) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'You must be logged In' });
  }
  const storedToken = crypto.AES.decrypt(user.activeToken, process.env.JWT_SECRET).toString(crypto.enc.Utf8);
  if (storedToken !== JSON.stringify(token)) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Session Expired!' });
  }
  // if token and session verified then
  req.id = payload.id;
  return next();
};

module.exports = authorize;
