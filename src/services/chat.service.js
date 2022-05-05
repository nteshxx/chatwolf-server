/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const { Message, User } = require('../models');

const pushMessage = async (senderId, receiverId, chatId, text, attachment) => {
  Message.create({ senderId, receiverId, chatId, text, attachment });
};

const retrieveChat = async (chatId, page, limit) => {
  const skipIndex = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const totalMessages = await Message.find({ chatId }).count();
  const totalPages = Math.ceil(totalMessages / parseInt(limit, 10));
  const messages = await Message.find({ chatId })
    .skip(skipIndex)
    .limit(parseInt(limit, 10))
    .sort([['createdAt', -1]])
    .lean();
  messages.reverse();
  return { totalPages, currentPage: page, limit, messages };
};

const retrieveAllChats = async (userId) => {
  // get all messages of a user and group by unique receivers in descending order
  const allChats = await Message.aggregate([
    { $match: { $or: [{ senderId: mongoose.Types.ObjectId(userId) }, { receiverId: mongoose.Types.ObjectId(userId) }] } },
    { $project: { chatId: 1, receiverId: 1, senderId: 1, text: 1, createdAt: 1 } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$chatId',
        senderId: { $first: '$senderId' },
        receiverId: { $first: '$receiverId' },
        text: { $first: '$text' },
        timeStamp: { $first: '$createdAt' },
        // totalMessagesCount: { $sum: 1 },
      },
    },
    { $sort: { timeStamp: -1 } },
  ]);

  // get name and avatar of all unique receivers
  const participants = allChats.reduce((prev, curr) => ({ _id: `${prev._id}-${curr._id}` }));
  const ids = participants._id.split('-').filter((id) => id !== userId);
  const users = await User.find({ _id: { $in: ids } }, '_id name avatar');
  const modUsers = users.map((user) => ({
    name: user.name,
    avatar: user.avatar,
    userid: user._id.toString(),
  }));

  // merge receivers name, avatar and last messages
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
  retrieveAllChats,
};
