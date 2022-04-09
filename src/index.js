const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const logger = require('./config/logger');
const { chatService } = require('./services');

dotenv.config();
const app = require('./app');

const httpServer = http.createServer(app);
// eslint-disable-next-line import/order
const io = require('socket.io')(httpServer, {
  cors: {
    origin: [process.env.ALLOWED_CLIENT1, process.env.ALLOWED_CLIENT2],
    methods: ['GET', 'POST'],
  },
});

app.set('socketio', io);

const users = {};

// for fetching online users
app.get('/online-users', (req, res) => {
  res.status(200).json(users);
});

io.on('connection', (socket) => {
  logger.info(`user connected: ${socket.id}`);

  socket.on('new-online-user', (user) => {
    users[user] = socket.id;
    // inform all-online-users that a user is disconnected
    // emit the updated online users object
    io.emit('all-online-users', users);
  });

  socket.on('disconnect', () => {
    Object.keys(users).map((user) => {
      if (users[user] === socket.id) {
        delete users[user];
      }
      return users[user];
    });
    logger.info(`${socket.id} disconnected`);
    // inform all-online-users that a user is disconnected
    // emit the updated online users object
    io.emit('all-online-users', users);
  });

  // send-receive messages using socketio
  socket.on('send-new-message', (data) => {
    // pushing the message in mongodb db
    const { username, receiver, chatId, text, attachment } = data;
    chatService.pushMessage(username.split('-')[1], receiver.split('-')[1], chatId, text, attachment);
    // emit on "chatId" channel to specific (socket.id) only
    // socket.to('socket.id').emit('channel', data)
    const socketId = users[data.receiver];
    io.to(socketId).emit(`${chatId}`, data);
  });
});

// connection to database
mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    logger.info('Connected to MongoDB');
    httpServer.listen(process.env.PORT, () => {
      logger.info(`Listening to port ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    logger.error('Connection to MongoDB failed', e);
  });
