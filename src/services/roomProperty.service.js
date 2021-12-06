const httpStatus = require('http-status');
const RoomProperty = require('../models/roomProperty.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a property
 * @param {Object} roomBody
 * @returns {Promise<RoomProperty>}
 */
const createRoomProperty = async (roomBody) => {
  const property = await RoomProperty.create(roomBody);
  return property;
};

/**
 * Get Property by id
 * @param {ObjectId} id
 * @returns {Promise<RoomProperty>}
 */
const getPropertyById = async (id) => {
  return RoomProperty.findByPk(id);
};

/**
 * Get Property by userId
 * @param {number} userId
 * @returns {Promise<RoomProperty>}
 */
const getPropertyByUserId = async (userId) => {
  return RoomProperty.findOne({
    where: {
      userId,
    },
  });
};

/**
 * Update Property by roomId
 * @param {number} roomId
 * @param body
 * @returns {Promise<RoomProperty>}
 */
const updatePropertyByRoomId = async (id, body) => {
  const property = await getPropertyById(id);
  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  }
  Object.assign(property, body.roomDesc);
  await property.save();
  return property;
};

/**
 * Delete Property by userId
 * @param {number} userId
 * @returns {Promise<RoomProperty>}
 */
const deletePropertyByUserId = async (userId) => {
  const property = await RoomProperty.destroy({ userId });
  return property;
};

exports.module = {
  createRoomProperty,
  getPropertyById,
  getPropertyByUserId,
  deletePropertyByUserId,
  updatePropertyByRoomId,
};
