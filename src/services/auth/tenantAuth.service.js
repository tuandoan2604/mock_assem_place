const UserModel = require('../../models/profile.model');
const deviceService = require('../deviceEntity.service');
const RoomProperty = require('../../models/roomProperty.model');

/**
 * Create a tenant user
 * @param {Object} userBody
 * @returns {Promise<{idType, user: Model<TModelAttributes, TCreationAttributes>, device: Model<any, TModelAttributes>, room: Model<TModelAttributes, TCreationAttributes>}>}
 */

const createUser = async (userBody) => {
  const email = userBody.userInfor.email.toLowerCase();
  const user = await UserModel.create({ ...userBody.userInfor, email });
  const roomBody = {
    userId: user.id,
    ...userBody.roomDesc,
  };
  const [room, device] = [
    await RoomProperty.create(roomBody),
    await deviceService.createDevice(user.id, userBody.deviceEntity),
  ];
  const { idType } = userBody;
  return { idType, user, room, device };
};

module.exports = {
  createUser,
};
