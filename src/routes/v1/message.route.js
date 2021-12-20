const express = require('express');
const auth = require('../../middlewares/auth');

const route = express.Router();
const { addNewMess, getAllMess } = require('../../controllers/message.controller');

route.post('/', auth('homeowner' || 'tenant' || 'agent'), addNewMess);
route.get('/:conversationId', auth('homeowner' || 'tenant' || 'agent'), getAllMess);

module.exports = route;
