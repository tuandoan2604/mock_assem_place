const { DataTypes } = require('sequelize');
const db = require('./index.js');
const User = require('./profile.model');

const RoomProperty = db.define('RoomProperty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  RentalAddress: {
    type: DataTypes.TEXT,
  },
  PlaceType: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  RoomProperty: {
    type: DataTypes.JSON,
  },
  LeasePeriod: {
    type: DataTypes.JSON,
  },
  BudgetPrice: {
    type: DataTypes.JSON,
  },
  PriceFlexibility: {
    type: DataTypes.INTEGER,
  },
  Location: {
    type: DataTypes.JSON,
  },
});

RoomProperty.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
db.sync();
module.exports = RoomProperty;
