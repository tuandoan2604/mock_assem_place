const httpStatus = require('http-status');
//const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/responseTemp');
const { roomService } = require('../services');

const getRoomById = catchAsync(async (req, res) => {
  const room = await roomService.getRoomById(req.params.roomId);
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'Get Room Success', room));
});

const getRoomByUserId = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  var rooms = await roomService.getRoomByUserId(userId);
  if (Object.keys(req.query).length !== 0) {
    rooms = await roomService.getRoomByUserIdAndStatus(userId, req.query.active);
  }
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', rooms));
});

const getRoomProperties = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  const roomProperties = await roomService.getRoomPropertiesByUserId(userId);
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'Get Room Properties Success', roomProperties));
});

const createRoom = catchAsync(async (req, res) => {
  const roomBody = {
    userId: req.user.profileId,
    ...req.body.roomDesc,
  };
  const room = await roomService.createRoom(roomBody);
  res.status(httpStatus.CREATED).send(response(httpStatus.CREATED, 'Creat Room Success', room));
});

const updateRoom = catchAsync(async (req, res) => {
  const room = await roomService.updateRoomByRoomId(req.params.roomId, req.body);
  res.send(response(httpStatus.OK, 'Update Room Success', room));
});

const updateRoomProperties = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  const room = await roomService.updateRoomPropertiesByUserId(userId, req.body);
  res.send(response(httpStatus.OK, 'Update Room Properties Success', room));
});

const deleteRoomByRoomId = catchAsync(async (req, res) => {
  await roomService.deleteRoomByRoomId(req.params.roomId);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Delete Room Success', null));
});

const queryRoomsByProperties = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  const roomProperties = await roomService.getRoomPropertiesByUserId(userId);
  const listId = await roomService.queryRoomsByAttributes(roomProperties[0]);
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'Query Room Attributes Success', listId));
});

module.exports = {
  createRoom,
  updateRoom,
  deleteRoomByRoomId,
  getRoomById,
  getRoomByUserId,
  getRoomProperties,
  updateRoomProperties,
  queryRoomsByProperties,
};
