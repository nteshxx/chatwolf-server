const { Chat, Message, User } = require('../models');

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
  const allChatsId = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] }).distinct('chatId');
  const participants = allChatsId
    .reduce((prev, curr) => `${prev}-${curr}`)
    .split('-')
    .filter((id) => id !== userId);
  const users = await User.find({ _id: { $in: participants } }, '_id name');
  return users;
};

module.exports = {
  pushMessage,
  retrieveChat,
  createNewChat,
  retrieveAllChats,
};
