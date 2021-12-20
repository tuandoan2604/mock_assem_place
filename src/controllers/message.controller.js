const httpStatus = require('http-status');
const response = require('../utils/responseTemp');
const catchAsync = require('../utils/catchAsync');
const { getUser } = require('../utils/redis');
const io = require('../index');
const { addMessage, getAllMessageInConversation } = require('../services/message.service');

const addNewMess = catchAsync(async (req, res) => {
  const message = await addMessage(req.body);
  res.send(response(httpStatus.CREATED, 'Created', message));
});

const getAllMess = catchAsync(async (req, res) => {
  const userSocketId = await getUser(req.user.id);
  const messages = await getAllMessageInConversation(req.params.conversationId);
  if(userSocketId !== null) io.ioObject.to(userSocketId).emit('getAllMess', messages);
  res.send(response(httpStatus.OK, 'OK', messages));
});
module.exports = {
  addNewMess,
  getAllMess,
};
