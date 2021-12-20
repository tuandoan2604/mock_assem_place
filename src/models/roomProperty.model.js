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

RoomProperty.queryTenantByOnwerRoomPropertise = async function (
  p_latitude,
  p_longitute,
  p_distance_rate,
  p_distance_max,
  p_price_type,
  p_max_price,
  p_min_price,
  p_price,
  p_price_rate,
  p_property_type,
  p_room_type,
  p_cooking,
  p_lease_period,
  p_bedroom_number,
  p_bathroom_number,
  p_keywords,
  p_total,
  p_life_style,
  p_preferences,
  p_gender
) {
  const listId = await db.query(
    'SELECT * FROM public."filterTenantByOwnerRoomAttributes"($1, $2, $3, $4::numeric,$5::text, $6, $7, $8, $9, $10, $11, $12, $13::text[], $14, $15, $16, $17, $18, $19::text[], $20::text)',
    {
      bind: [
        p_latitude,
        p_longitute,
        p_distance_rate,
        p_distance_max,
        p_price_type,
        p_max_price,
        p_min_price,
        p_price,
        p_price_rate,
        p_property_type,
        p_room_type,
        p_cooking,
        p_lease_period,
        p_bedroom_number,
        p_bathroom_number,
        p_keywords,
        p_total,
        p_life_style,
        p_preferences,
        p_gender,
      ],
    }
  );
  return listId;
};

RoomProperty.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
db.sync();
module.exports = RoomProperty;
