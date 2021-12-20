const httpStatus = require('http-status');
const { addConversation, getConversationWithUserId, getConversationDetail } = require('../services/conversation.service');
const response = require('../utils/responseTemp');
const catchAsync = require('../utils/catchAsync');

const addNewConversation = catchAsync(async (req, res) => {
  const newConversation = await addConversation(req.body.senderId, req.body.receiverId);
  res.send(response(httpStatus.CREATED, 'Created', newConversation));
});

const getConversation = catchAsync(async (req, res) => {
  const conversations = await getConversationWithUserId(req.params.userId);
  res.send(response(httpStatus.OK, 'OK', conversations));
});

const getConversationBetweenTwoUser = catchAsync(async (req, res) => {
  const conversation = await getConversationDetail(req.params.firstUserId, req.params.secondUserId);
  res.send(response(httpStatus.OK, 'OK', conversation));
});

module.exports = {
  addNewConversation,
  getConversation,
  getConversationBetweenTwoUser,
};
