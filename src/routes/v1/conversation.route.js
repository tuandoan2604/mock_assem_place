const express = require('express');
const auth = require('../../middlewares/auth');
const route = express.Router();

const {
  addNewConversation,
  getConversation,
  getConversationBetweenTwoUser,
} = require('../../controllers/conversation.controller');

route.post('/', auth('homeowner' || 'tenant' || 'agent'), addNewConversation);

route.get('/:userId', auth('homeowner' || 'tenant' || 'agent'), getConversation);

route.get('/find/:firstUserId/:secondUserId', auth('homeowner' || 'tenant' || 'agent'), getConversationBetweenTwoUser);

module.exports = route;
