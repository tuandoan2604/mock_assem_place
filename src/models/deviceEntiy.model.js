const { DataTypes } = require('sequelize');
const db = require('./index.js');
const UserModel = require('./profile.model');
// // const { toJSON } = require('./plugins');
// // const { tokenTypes } = require('../config/tokens');

const DeviceEntity = db.define('DeviceEntity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  os: {
    type: DataTypes.INTEGER,
  },
  deviceId: {
    type: DataTypes.TEXT,
  },
  token: {
    type: DataTypes.TEXT,
  },
});

UserModel.hasMany(DeviceEntity);
DeviceEntity.belongsTo(UserModel, { foreignKey: 'userId', targetKey: 'id' });
db.sync();
module.exports = DeviceEntity;
