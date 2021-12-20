const redis = require('redis');
const config = require('../config/config');
const logger = require('../config/logger');

const client = redis.createClient('redis://redistogo:327b42f444a57620625a31f9eb4df4b7@sole.redistogo.com:10261/', {
  tls: { rejectUnauthorized: false },
});

client.on('error', (err) => {
  logger.info('redis connect', err);
});

client
  .connect()
  .then(() => {
    logger.info('redis connected');
  })
  .catch((err) => {
    logger.info('redis connect error ', err);
  });

const addUser = async (userId, socketId) => {
  await client.set(userId.toString(), socketId);
};

const getUser = async (userId) => {
  const socketId = await client.get(userId.toString());
  return socketId;
};

const getAllUser = async () => {
  const userIds = await client.keys('*');
  return userIds;
};

const deleteUser = async (socket) => {
  const userIds = await client.keys('*');
  await userIds.forEach(async (userId) => {
    const socketId = await client.get(userId);
    if (socketId === socket) {
      await client.del(userId);
    }
  });
  const userIdAfterDelete = await client.keys('*');
  return userIdAfterDelete;
};

module.exports = {
  addUser,
  getUser,
  deleteUser,
  getAllUser,
};
