const http = require('https');
const app = require('./app');
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
server = app.listen(config.port, () => {
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

setInterval(function () {
  http.get('https://assem-place-mock.herokuapp.com');
}, 300000); // every 5 minutes (300000)
