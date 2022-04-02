/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
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
  // get all messages of a user and group by unique receivers in descending order
  const allChats = await Message.aggregate([
    { $match: { $or: [{ senderId: mongoose.Types.ObjectId(userId) }, { receiverId: mongoose.Types.ObjectId(userId) }] } },
    { $project: { chatId: 1, receiverId: 1, senderId: 1, text: 1, attachment: 1, createdAt: 1 } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$chatId',
        senderId: { $first: '$senderId' },
        receiverId: { $first: '$receiverId' },
        text: { $first: '$text' },
        attachment: { $first: '$attachment' },
        timeStamp: { $first: '$createdAt' },
        numberOfMessages: { $sum: 1 },
      },
    },
    { $sort: { timeStamp: -1 } },
  ]);

  // get name of all unique receivers
  const participants = allChats.reduce((prev, curr) => ({ _id: `${prev._id}-${curr._id}` }));
  const ids = participants._id.split('-').filter((id) => id !== userId);
  const users = await User.find({ _id: { $in: ids } }, '_id name');
  const modUsers = users.map((user) => ({
    name: user.name,
    userid: user._id.toString(),
  }));

  // merge receivers name and thier last message
  const result = [];
  for (let i = 0; i < allChats.length; i += 1) {
    result.push({
      ...allChats[i],
      ...modUsers.find(
        (user) => user.userid === allChats[i].senderId.toString() || user.userid === allChats[i].receiverId.toString()
      ),
    });
  }
  return result;
};

module.exports = {
  pushMessage,
  retrieveChat,
  createNewChat,
  retrieveAllChats,
};
