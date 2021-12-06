const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { roomController } = require('../../controllers');
const roomValidation = require('../../validations/room.validation');
const { checkRoomAction } = require('../../middlewares/validateAction');

const router = express.Router();

router
  .route('/paginate')
  .get(auth('tenant'), roomController.queryRoomsByProperties)
  .post(auth('tenant'), roomController.queryRoomsByProperties);

router
  .route('/')
  .get(auth('homeowner'), roomController.getRoomByUserId)
  .post(auth('homeowner'), validate(roomValidation.createRoom), roomController.createRoom);

router
  .route('/properties')
  .get(auth('tenant'), roomController.getRoomProperties)
  .patch(auth('tenant'), validate(roomValidation.updateRoomProperties), roomController.updateRoomProperties);

router
  .route('/:roomId')
  .get(auth('homeowner'), checkRoomAction, roomController.getRoomById)
  .patch(auth('homeowner'), checkRoomAction, validate(roomValidation.updateRoom), roomController.updateRoom)
  .delete(auth('homeowner'), checkRoomAction, roomController.deleteRoomByRoomId);

module.exports = router;
