const { Sequelize } = require('sequelize');
const config = require('../config/config');
const logger = require('../config/logger');

const db = new Sequelize(config.poolPostGre.database, config.poolPostGre.user, config.poolPostGre.password, {
  host: config.poolPostGre.host,
  dialect: 'postgres',
  port: config.poolPostGre.port,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

db.authenticate()
  .then(() => {
    logger.info('Connection PostGreSQL successfully.');
  })
  .catch((err) => {
    logger.info('Unable to connect to the database:', err);
  });

module.exports = db;
// module.exports.Token = require('./token.model');
// module.exports.User = require('./user.model');
