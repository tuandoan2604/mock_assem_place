const Message = require('../models/message.model');

const addMessage = async (messageBody) => {
  const message = await Message.create(messageBody);
  return message;
};

const getAllMessageInConversation = async (conversationId) => {
  return Message.findAll({
    where: {
      conversationId,
    },
  });
};

module.exports = {
  addMessage,
  getAllMessageInConversation,
};
