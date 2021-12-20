const SuitableRoomEntity = require('../models/suitableRoom.model');

const likeRoom = async (roomId, userId, status) => {
  const roomMatched = await SuitableRoomEntity.findOne({
    where: {
      userId,
      roomId,
    },
  });
  if (roomMatched) {
    roomMatched.like = status;
    await roomMatched.save();
  } else {
    const matchRoom = new SuitableRoomEntity();
    matchRoom.userId = userId;
    matchRoom.roomId = roomId;
    matchRoom.like = status;
    await matchRoom.save();
  }
  return roomMatched;
};

const getFavoriteOrPassRoom = async (userId, status) => {
  try {
    const list = await SuitableRoomEntity.findAll({
      where: {
        userId,
        like: status,
      },
    });
    return list;
  } catch (e) {
    throw new Error(`[likeRoom] ${e}`);
  }
};
module.exports = { likeRoom, getFavoriteOrPassRoom };
