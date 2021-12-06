const httpStatus = require('http-status');
const { roomService } = require('../services');

const checkRoomAction = async (req, res, next) => {
  const userId = req.user.profileId;
  const room = await roomService.getRoomById(req.params.roomId);
  if (!room) {
    return res.status(httpStatus.NOT_FOUND).send();
  }
  if (userId !== room.userId) {
    return res.status(httpStatus.NOT_FOUND).send();
  }
  next();
};

const checkUserAction = (req, res, next) => {
  const userId = req.user.profileId;
  const currentId = parseInt(req.params.userId, 10);
  if (userId !== currentId) {
    return res.status(httpStatus.NOT_FOUND).send();
  }
  next();
};

module.exports = {
  checkRoomAction,
  checkUserAction,
};
