const { DataTypes } = require('sequelize');
const db = require('./index.js');
const User = require('./profile.model');

const RoomDesc = db.define('Room', {
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
    type: DataTypes.TEXT,
  },
  RoomDetails: {
    type: DataTypes.JSON,
  },
  LeasePeriod: {
    type: DataTypes.JSON,
  },
  PicturesVideo: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  RentalPrice: {
    type: DataTypes.JSON,
  },
  PriceFlexibility: {
    type: DataTypes.INTEGER,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  Location: {
    type: DataTypes.JSON,
  },
  Video: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
});

// RoomDesc.queryRoomsByPropertise = async function (p_latitude, p_longitute, p_max_price, p_min_price) {
//   const listId = await db.query(
//     `SELECT * FROM public."filterRoomsByAttributesTest"(${p_latitude},${p_longitute}, ${p_max_price},${p_min_price})`
//   );
//   return listId;
// };

RoomDesc.queryRoomsByPropertise = async function (
  p_latitude,
  p_longitute,
  p_distance_rate,
  p_distance_max,
  p_max_price,
  p_min_price,
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
    'SELECT * FROM public."filterRoomsByAttributes"($1, $2, $3, $4::numeric, $5,$6, $7, ($8::text[]), $9::text, $10, $11::text[], $12::text[], $13::text[], $14::text[], $15, $16::text[], $17::text[], $18::text)',
    {
      bind: [
        p_latitude,
        p_longitute,
        p_distance_rate,
        p_distance_max,
        p_max_price,
        p_min_price,
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

/**
 * Query for documents with pagination
 * @param {Object} [filter] - Mongo filter
 * @param {Object} [options] - Query options
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
RoomDesc.paginate = async function (filter, options) {
  let sort = '';
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push((order === 'desc' ? '-' : '') + key);
    });
    sort = sortingCriteria.join(' ');
  } else {
    sort = 'createdAt';
  }

  const limit = options.limit && parseInt(options.limit, 20) > 0 ? parseInt(options.limit, 20) : 20;
  const page = options.page && parseInt(options.page, 20) > 0 ? parseInt(options.page, 20) : 1;
  const skip = (page - 1) * limit;

  const rooms = this.findAndCountAll({ where: filter, limit, page });
};

// User.hasMany(RoomDesc);
RoomDesc.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
db.sync();
module.exports = RoomDesc;
