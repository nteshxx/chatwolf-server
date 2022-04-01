const express = require('express');
const validate = require('../middlewares/validate');
const chatValidator = require('../validations/chat.validator');
const chatController = require('../controllers/chat.controller');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/all-chats', authorize(), chatController.getChats);
router.post('/send-message', authorize(), validate(chatValidator.sendMessage), chatController.sendMessage);
router.post('/get-messages', authorize(), validate(chatValidator.getMessages), chatController.getMessages);
// router.post('/create-chat', authorize(), validate(chatValidator.createChat), chatController.createChat);

module.exports = router;
