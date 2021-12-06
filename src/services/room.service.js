const httpStatus = require('http-status');
const RoomDesc = require('../models/roomdesc.model');
const RoomProperty = require('../models/roomProperty.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
/**
 * Create a room
 * @param {Object} roomBody
 * @returns {Promise<RoomDesc>}
 */
const createRoom = async (roomBody) => {
  const room = await RoomDesc.create(roomBody);
  return room;
};

/**
 * Get room by id
 * @param {ObjectId} id
 * @returns {Promise<RoomDesc>}
 */
const getRoomById = async (id) => {
  return RoomDesc.findByPk(id);
};

/**
 * Get room by userId
 * @param {number} userId
 * @returns {Promise<RoomDesc>}
 */
const getRoomByUserId = async (userId) => {
  return RoomDesc.findAll({
    where: {
      userId,
    },
  });
};

const getRoomPropertiesByUserId = async (userId) => {
  return RoomProperty.findAll({
    where: {
      userId,
    },
  });
};

const updateRoomPropertiesByUserId = async (userId, body) => {
  const roomProperties = await getRoomPropertiesByUserId(userId);
  const properties = await RoomProperty.findByPk(roomProperties[0].id);
  if (!properties) {
    throw new ApiError(httpStatus.NOT_FOUND, 'roomProperties not found');
  }
  Object.assign(properties, body.roomDesc);
  await properties.save();
  return properties;
};

const getRoomByUserIdAndStatus = async (userId, status) => {
  return RoomDesc.findAll({
    where: {
      userId,
      isActive: status,
    },
  });
};

/**
 * Update room by roomId
 * @param {number} roomId
 * @param body
 * @returns {Promise<RoomDesc>}
 */
const updateRoomByRoomId = async (roomId, body) => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  Object.assign(room, body.roomDesc);
  await room.save();
  return room;
};

/**
 * Delete room by userId
 * @param {number} userId
 * @returns {Promise<RoomDesc>}
 */
const deleteRoomByUserId = async (userId) => {
  const room = await RoomDesc.destroy({ userId });
  return room;
};

/**
 * Delete room by roomId
 * @param {number} roomId
 * @returns {Promise<RoomDesc>}
 */
const deleteRoomByRoomId = async (roomId) => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  room.destroy();
};

/**
 * Get rooms by matchAttributes
 * @param {number} userId
 * @returns {Promise<RoomDesc>}
 */
const getRoomsByMatchAttributes = async (userId) => {
  const properties = await getRoomPropertiesByUserId(userId);
  if (!properties) {
    throw new ApiError(httpStatus.NOT_FOUND, 'properties not found');
  }
  return properties;
};

/**
 * Query rooms by attributes
 * @returns {Promise<[undefined, number]>}
 * @param properties
 */
const queryRoomsByAttributes = async (properties) => {
  const listId = await RoomDesc.queryRoomsByPropertise(
    properties.Location.Latitude,
    properties.Location.Longitude,
    config.matching_room.distance_rate,
    config.matching_room.distance_max,
    properties.BudgetPrice.Max,
    properties.BudgetPrice.Min,
    config.matching_room.price_rate,
    properties.PlaceType,
    properties.RoomProperty.RoomType,
    properties.RoomProperty.AllowCook,
    properties.LeasePeriod.value,
    properties.RoomProperty.BedroomNumber,
    properties.RoomProperty.BathroomNumber,
    properties.RoomProperty.KeyWords,
    config.matching_room.total_percent,
    null,
    null,
    null
  );
  if (!listId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'listRoom not found');
  }
  return listId;
};

module.exports = {
  createRoom,
  getRoomById,
  getRoomByUserId,
  updateRoomByRoomId,
  deleteRoomByUserId,
  deleteRoomByRoomId,
  getRoomByUserIdAndStatus,
  getRoomsByMatchAttributes,
  getRoomPropertiesByUserId,
  updateRoomPropertiesByUserId,
  queryRoomsByAttributes,
};
