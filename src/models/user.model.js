const { DataTypes } = require('sequelize');
const db = require('./index.js');
const SuitableRoomEntity = require('./suitableRoom.model');
const Profile = require('./profile.model');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.TEXT,
  },
  expires: {
    type: DataTypes.DATE,
  },
  idType: {
    type: DataTypes.TEXT,
  },
  role: {
    type: DataTypes.TEXT,
    defaultValue: 'user',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
  },
  forgotPassToken: {
    type: DataTypes.TEXT,
  },
  verifyEmailToken: {
    type: DataTypes.TEXT,
  },
  resetPassToken: {
    type: DataTypes.TEXT,
  },
  faceBookToken: {
    type: DataTypes.TEXT,
  },
  gmailToken: {
    type: DataTypes.TEXT,
  },
  smsToken: {
    type: DataTypes.TEXT,
  },
});

User.belongsTo(Profile, { foreignKey: 'profileId', targetKey: 'id' });
User.hasMany(SuitableRoomEntity, { foreignKey: 'userId', targetKey: 'id' });
db.sync();
module.exports = User;
