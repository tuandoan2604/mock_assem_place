const http = require('http');
const app = require('./app');

const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
// const postGre = new Client({
//   user: config.poolPostGre.user,
//   host: config.poolPostGre.host,
//   database: config.poolPostGre.database,
//   password: config.poolPostGre.password,
//   port: config.poolPostGre.port,
// })

// postGre.connect(function(err) {
//   if (err) throw err;
//   logger.info('Connected to PostGreSQL');
//   server = app.listen(config.port, () => {
//     logger.info(`Listening to port ${config.port}`);
//   });
// });
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

var users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  const user = users.filter((user) => user.socketId !== socketId);
  users = [...user];
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', async (socket) => {
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text, type }) => {
    const sender = getUser(senderId);
    const receiver = getUser(receiverId);
    if (receiver !== undefined) {
      io.to(receiver.socketId).emit('getMessage', {
        senderId,
        receiverId,
        text,
        type,
      });
    }
    io.to(sender.socketId).emit('getMessage', {
      senderId,
      receiverId,
      text,
      type,
    });
  });
  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

server = httpServer.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

const socketIoObject = io;
module.exports.ioObject = socketIoObject;
