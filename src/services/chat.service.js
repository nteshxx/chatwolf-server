const { Chat, Message } = require('../models');

const pushMessage = async (senderId, receiverId, chatId, text, attachment) => {
  const data = await Message.create({ senderId, receiverId, chatId, text, attachment });
  return data;
};

const retrieveChat = async (chatId) => {
  const messages = await Message.find({ chatId });
  return messages;
};

const createNewChat = async (userId, chatId) => {
  const chatExist = await Chat.findOne({ userId, chatId });
  if (chatExist) {
    return chatExist;
  }
  const data = await Chat.create({ userId, chatId });
  return data;
};

const retrieveAllChats = async (userId) => {
  const chats = await Chat.find({ userId });
  return chats;
};

module.exports = {
  pushMessage,
  retrieveChat,
  createNewChat,
  retrieveAllChats,
};
