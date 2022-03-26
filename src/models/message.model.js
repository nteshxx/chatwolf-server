const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
