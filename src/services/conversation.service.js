const { Op } = require('sequelize');
const Conversation = require('../models/conversation.model');

const addConversation = async (conversationBody) => {
  const conversation = await Conversation.create(conversationBody);
  return conversation;
};

const getConversationWithUserId = async (userId) => {
  return Conversation.findAll({
    where: {
      [Op.or]: [
        {
          firstUserId: userId,
        },
        {
          secondUserId: userId,
        },
      ],
    },
  });
};

const getConversationDetail = async (senderId, receiverId) => {
  return Conversation.findAll({
    where: {
      [Op.or]: [
        {
          firstUserId: senderId,
          secondUserId: receiverId,
        },
        {
          firstUserId: receiverId,
          secondUserId: senderId,
        },
      ],
    },
  });
};

module.exports = {
  addConversation,
  getConversationDetail,
  getConversationWithUserId,
};
