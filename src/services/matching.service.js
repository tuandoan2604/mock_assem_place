const Matching = require('../models/matching.model');
const SuitableRoomEntity = require('../models/suitableRoom.model');

const likeOrPassTenant = async (roomId, tenantId, ownerId, status) => {
  const peopleMatched = await Matching.findOne({
    where: {
      tenantId,
      ownerId,
    },
  });
  if (peopleMatched) {
    peopleMatched.like = status;
    if (checkSuitableRoomStatus(tenantId, roomId) && status) peopleMatched.availableChat = true;
    peopleMatched.availableChat = false;
    await peopleMatched.save();
  } else {
    const matchPeople = new Matching();
    matchPeople.tenantId = tenantId;
    matchPeople.ownerId = ownerId;
    matchPeople.like = status;
    if (checkSuitableRoomStatus(tenantId, roomId) && status) matchPeople.availableChat = true;
    matchPeople.availableChat = false;
    await matchPeople.save();
  }
  return peopleMatched;
};

const getMatching = async (tenantId, ownerId) => {
  return Matching.findOne({
    where: {
      tenantId,
      ownerId,
    },
  });
};

const updateChatStatus = async (tenantId, ownerId, status) => {
  const matching = await Matching.findOne({
    where: {
      tenantId,
      ownerId,
    },
  });
  if (matching) {
    matching.availableChat = status;
    await matching.save();
  }
};

const checkSuitableRoomStatus = async (tenantId, roomId) => {
  const suitabaleRoom = await SuitableRoomEntity.findOne({
    where: {
      userId: tenantId,
      roomId,
    },
  });
  if (suitabaleRoom !== null && suitabaleRoom.like) return true;
  return false;
};

const getLikeOrPassPeople = async (ownerId, status) => {
  try {
    const list = await Matching.findAll({
      where: {
        ownerId,
        like: status,
      },
    });
    return list;
  } catch (e) {
    throw new Error();
  }
};
module.exports = { likeOrPassTenant, getLikeOrPassPeople, getMatching, updateChatStatus };
