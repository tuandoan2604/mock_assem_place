const httpStatus = require('http-status');
const response = require('../utils/responseTemp');
const catchAsync = require('../utils/catchAsync');
const { addMessage, getAllMessageInConversation } = require('../services/message.service');

const addNewMess = catchAsync(async (req, res) => {
  const message = await addMessage(req.body.conversationId, req.body.sender, req.body.text, req.body.type);
  res.send(response(httpStatus.CREATED, 'Created', message));
});

const getAllMess = catchAsync(async (req, res) => {
  const messages = await getAllMessageInConversation(req.params.conversationId);
  res.send(response(httpStatus.OK, 'OK', messages));
});
module.exports = {
  addNewMess,
  getAllMess,
};
