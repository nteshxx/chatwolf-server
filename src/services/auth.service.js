const bcrypt = require('bcryptjs');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');

dotenv.config();

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const createUser = async (name, email, password) => {
  const userExist = await getUserByEmail(email);
  if (userExist) {
    throw new APIError(httpStatus.BAD_REQUEST, 'Email Already Token');
  }
  const hashedPassword = await bcrypt.hash(password, 8);
  const user = await User.create({ name, email, password: hashedPassword });
  return user;
};

const generateToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRE}d` });
  const encryptedToken = await crypto.AES.encrypt(JSON.stringify(token), process.env.JWT_SECRET).toString();
  await User.findOneAndUpdate({ _id: userId }, { activeToken: encryptedToken }, { new: true });
  return token;
};

const loginWithEmailAndPassword = async (email, password) => {
  const user = await getUserByEmail(email);
  if (user) {
    const doMatch = await bcrypt.compare(password, user.password);
    const token = doMatch ? await generateToken(user.id) : null;
    if (token === null) {
      throw new APIError(httpStatus.BAD_REQUEST, 'Invalid Email or Password');
    }
    return token;
  }
  throw new APIError(httpStatus.BAD_REQUEST, 'Invalid Email or Password');
};

const logout = async (userId) => {
  const user = await User.findOneAndUpdate({ _id: userId }, { activeToken: null }, { new: true });
  return user;
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  generateToken,
  loginWithEmailAndPassword,
  logout,
};
