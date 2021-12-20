const { DataTypes } = require('sequelize');
// eslint-disable-next-line import/extensions
const db = require('./index.js');

const Matching = db.define('Matching', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
  },
  tenantId: {
    type: DataTypes.INTEGER,
  },
  like: {
    type: DataTypes.BOOLEAN,
  },
  availableChat: {
    type: DataTypes.BOOLEAN,
  },
});

db.sync();
module.exports = Matching;
