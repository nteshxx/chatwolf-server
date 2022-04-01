const Joi = require('joi');
const { joiPassword } = require('joi-password');

const register = {
  body: Joi.object()
    .keys({
      name: Joi.string().min(3).max(20).required(),
      email: Joi.string().email().required(),
      password: joiPassword
        .string()
        .min(8)
        .max(25)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .messages({
          'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
          'password.minOfSpecialCharacters': '{#label} should contain at least {#min} special character',
          'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
          'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
          'password.noWhiteSpaces': '{#label} should not contain white spaces',
        })
        .required(),
    })
    .min(3)
    .max(3),
};

const login = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(25).required(),
    })
    .min(2)
    .max(2),
};

const update = {
  body: Joi.object()
    .keys({
      name: Joi.string().min(3).max(20).required(),
      password: joiPassword
        .string()
        .min(8)
        .max(25)
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .messages({
          'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
          'password.minOfSpecialCharacters': '{#label} should contain at least {#min} special character',
          'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
          'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
          'password.noWhiteSpaces': '{#label} should not contain white spaces',
        })
        .required(),
    })
    .min(2)
    .max(2),
};

module.exports = {
  register,
  login,
  update,
};
