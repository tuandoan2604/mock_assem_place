const { DataTypes } = require('sequelize');
const Conversation = require('./conversation.model');
const db = require('./index.js');

const Message = db.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conversationId: {
    type: DataTypes.INTEGER,
  },
  senderId: {
    type: DataTypes.INTEGER,
  },
  text: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
});

Message.belongsTo(Conversation, { foreignKey: 'conversationId', targetKey: 'id' });
db.sync();
module.exports = Message;
