const http = require('http');
const app = require('./app');

const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const config = require('./config/config');
const logger = require('./config/logger');
const { addUser, getUser, deleteUser, getAllUser } = require('./utils/redis');

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

io.on('connection', async (socket) => {
  socket.on('addUser', async (userId) => {
    addUser(userId, socket.id);
    const users = await getAllUser();
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, text, type }) => {
    const senderSocketId = await getUser(senderId);
    const receiverSocketId = await getUser(receiverId);
    if (receiverSocketId !== null) {
      io.to(receiverSocketId).emit('getMessage', {
        senderId,
        receiverId,
        text,
        type,
      });
    }
    io.to(senderSocketId).emit('getMessage', {
      senderId,
      receiverId,
      text,
      type,
    });
  });
  socket.on('disconnect', async () => {
    await deleteUser(socket.id);
    const users = await getAllUser();
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
