const { DataTypes } = require('sequelize');
const db = require('./index.js');
const UserModel = require('./profile.model');

const NotificationEntity = db.define('NotificationEntity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  content: {
    type: DataTypes.TEXT,
  },
});

UserModel.hasMany(NotificationEntity);
NotificationEntity.belongsTo(UserModel, { foreignKey: 'userId', targetKey: 'id' });
db.sync();
module.exports = NotificationEntity;
