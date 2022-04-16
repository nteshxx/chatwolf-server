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
  body: Joi.object()
    .keys({
      chatId: Joi.string().required(),
    })
    .min(1)
    .max(1),
};

module.exports = {
  sendMessage,
  getMessages,
};
