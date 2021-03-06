const httpStatus = require('http-status');
const chatService = require('../services/chat.service');
const catchAsync = require('../utils/catchAsync');

const sendMessage = catchAsync(async (req, res) => {
  const { senderId, receiverId, chatId, text, attachment } = req.body;
  const io = req.app.get('socketio');
  const data = await chatService.pushMessage(senderId, receiverId, chatId, text, attachment);
  if (data) {
    // emit on receive-new-message channel to specific socket id socket.to('socket').emit('channel', data)
    io.emit(`${chatId}`, data);
    return res.status(httpStatus.OK).json({ message: 'Success', text: data });
  }
  return res.status(httpStatus.OK).json({ message: 'Failed' });
});

const getMessages = catchAsync(async (req, res) => {
  const { chatId, page, limit } = req.query;
  const result = await chatService.retrieveChat(chatId, page, limit);
  if (result.messages.length === 0) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'No Messages Found', result });
  }
  return res.status(httpStatus.OK).json({ message: 'Success', result });
});

const getChats = catchAsync(async (req, res) => {
  const userId = req.id;
  const chats = await chatService.retrieveAllChats(userId);
  res.status(httpStatus.OK).json({ message: 'Success', chats });
});

module.exports = {
  sendMessage,
  getMessages,
  getChats,
};
