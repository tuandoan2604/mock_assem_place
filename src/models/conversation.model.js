const { DataTypes } = require('sequelize');
const db = require('./index.js');

const Conversation = db.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstUserId: {
    type: DataTypes.INTEGER,
  },
  secondUserId: {
    type: DataTypes.INTEGER,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

db.sync();
module.exports = Conversation;
