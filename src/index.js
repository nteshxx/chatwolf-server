/* eslint-disable func-names */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
// const jwt = require('jsonwebtoken');
const logger = require('./config/logger');
// const APIError = require('./utils/APIError');

dotenv.config();
const app = require('./app');

// eslint-disable-next-line import/order
const httpServer = http.createServer(app);
// eslint-disable-next-line import/order
const io = require('socket.io')(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://chatwolf.vercel.app/'],
    methods: ['GET', 'POST'],
  },
});

app.set('socketio', io);

const users = {};

// for manual fetch of users
app.get('/online-users', (req, res) => {
  res.status(200).json(users);
});

io.on('connection', (socket) => {
  logger.info(`user connected: ${socket.id}`);

  socket.on('disconnect', () => {
    Object.keys(users).map((user) => {
      if (users[user] === socket.id) {
        delete users[user];
      }
      return users[user];
    });
    logger.info(`${socket.id} disconnected`);

    io.emit('all-online-users', users);
  });

  socket.on('new-online-user', (user) => {
    users[user] = socket.id;

    io.emit('all-online-users', users);
  });

  // send-receive messages using socketio
  socket.on('send-new-message', (data) => {
    const socketId = users[data.receiver];

    io.to(socketId).emit('receive-new-message', data);
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
