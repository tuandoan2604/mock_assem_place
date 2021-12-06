const httpStatus = require('http-status');
const DeviceEntityModel = require('../models/deviceEntiy.model');
const ApiError = require('../utils/ApiError');

/**
 * Create Device
 * @param {ObjectId} userId
 * @param {Object} deviceBody
 */
const createDevice = async (userId, deviceBody) => {
  const device = {
    userId,
    ...deviceBody,
  };
  const deviceEntities = await DeviceEntityModel.create(device);
  return deviceEntities;
};

/**
 * Get deivce by deviceId
 * @param {{where: {deviceId: number}}} deviceId
 * @returns {Promise<DeviceEntityModel>}
 */
const getDeviceByDeivceId = async (deviceId) => {
  return DeviceEntityModel.findOne({ deviceId });
};

/**
 * Get deivce by userId
 * @param {number} userId
 * @returns {Promise<UserModel>}
 */
const getDeviceByUserId = async (userId) => {
  return DeviceEntityModel.findAll({ userId });
};

/**
 * Update deivce by deviceId
 * @param {number} deviceId
 * @param token
 * @returns {Promise<DeviceEntityModel>}
 */
const updateDeviceByDeviceId = async (deviceId, token) => {
  if (!deviceId) return null;
  const device = await getDeviceByDeivceId({ where: { deviceId } });
  if (!device) {
    //throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
    return null;
  }
  device.token = token;
  await device.save();
  return device;
};

/**
 * Delete deivce by userId
 * @param {number} userId
 * @returns {Promise<UserModel>}
 */
const deleteDeviceByUserId = async (userId) => {
  const device = await DeviceEntityModel.destroy({ userId });
  return device;
};

/**
 * Delete deivce by deviceId
 * @param {number} deviceId
 * @returns {Promise<UserModel>}
 */
const deleteDeviceByDeviceId = async (deviceId) => {
  const device = await getDeviceByDeivceId(deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  await device.save();
  return device;
};

module.exports = {
  createDevice,
  getDeviceByDeivceId,
  getDeviceByUserId,
  updateDeviceByDeviceId,
  deleteDeviceByUserId,
  deleteDeviceByDeviceId,
};
