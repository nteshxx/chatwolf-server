const Joi = require('joi');

const register = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,25}$/)
        .required(),
    })
    .min(3)
    .max(3),
};

const login = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,25}$/)
        .required(),
    })
    .min(2)
    .max(2),
};

const update = {
  body: Joi.object()
    .keys({
      name: Joi.string(),
      password: Joi.string()
        .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,25}$/)
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
