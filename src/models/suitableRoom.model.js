const { DataTypes } = require('sequelize');
// eslint-disable-next-line import/extensions
const db = require('./index.js');

const SuitableRoomEntity = db.define('SuitableRoom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  roomId: {
    type: DataTypes.INTEGER,
  },
  like: {
    type: DataTypes.BOOLEAN,
  },
});

db.sync();
module.exports = SuitableRoomEntity;
