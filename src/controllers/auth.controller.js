const httpStatus = require('http-status');
const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const userData = await authService.createUser(name, email, password);
  if (userData) {
    const accessToken = await authService.generateToken(userData.id);
    const user = await authService.getUserById(userData.id);
    return res.status(httpStatus.CREATED).json({ message: 'Success', user, accessToken });
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: 'Email Already Taken' });
});

const signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const accessToken = await authService.loginWithEmailAndPassword(email, password);
  if (accessToken) {
    const user = await authService.getUserByEmail(email);
    return res.status(httpStatus.OK).json({ message: 'Success', user, accessToken });
  }
  return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid Email or Password' });
});

const signout = async (req, res) => {
  const userId = req.id;
  await authService.logout(userId);
  return res.status(httpStatus.OK).json({ message: 'Logged out Successfully' });
};

module.exports = {
  signup,
  signin,
  signout,
};
