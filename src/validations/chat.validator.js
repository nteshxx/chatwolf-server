const Joi = require('joi');
const { objectId } = require('./custom.validation');

const sendMessage = {
  body: Joi.object()
    .keys({
      chatId: Joi.string().required(),
      senderId: Joi.string().custom(objectId),
      receiverId: Joi.string().custom(objectId),
      text: Joi.string().required(),
      attachment: Joi.object().keys({
        image: Joi.boolean().required(),
        content: Joi.string().required(),
        name: Joi.string().required(),
      }),
    })
    .min(5)
    .max(5),
};

const getMessages = {
  query: Joi.object()
    .keys({
      chatId: Joi.string().required(),
      page: Joi.number().required().min(1),
      limit: Joi.number().required().min(1),
    })
    .min(3)
    .max(3),
};

module.exports = {
  sendMessage,
  getMessages,
};
