const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
