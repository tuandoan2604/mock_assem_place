const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/responseTemp');
const { roomService, userService, matchingService } = require('../services');
const { suitableService } = require('../services');
const config = require('../config/config');

const getRoomById = catchAsync(async (req, res) => {
  const room = await roomService.getRoomById(req.params.roomId);
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', room));
});

const getRoomByUserId = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  let rooms = await roomService.getRoomByUserId(userId);
  if (Object.keys(req.query).length !== 0) {
    rooms = await roomService.getRoomByUserIdAndStatus(userId, req.query.active);
  }
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', rooms));
});

const getRoomProperties = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  const roomProperties = await roomService.getRoomPropertiesByUserId(userId);
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', roomProperties));
});

const createRoom = catchAsync(async (req, res) => {
  const roomBody = {
    userId: req.user.profileId,
    ...req.body.roomDesc,
  };
  const room = await roomService.createRoom(roomBody);
  res.status(httpStatus.CREATED).send(response(httpStatus.CREATED, 'Creat Room Success', room));
});

const updateRoom = catchAsync(async (req, res) => {
  const room = await roomService.updateRoomByRoomId(req.params.roomId, req.body);
  res.send(response(httpStatus.OK, 'Update Room Success', room));
});

const updateRoomProperties = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  const room = await roomService.updateRoomPropertiesByUserId(userId, req.body);
  res.send(response(httpStatus.OK, 'Update Room Properties Success', room));
});

const deleteRoomByRoomId = catchAsync(async (req, res) => {
  await roomService.deleteRoomByRoomId(req.params.roomId);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Delete Room Success', null));
});

const queryRoomsByProperties = catchAsync(async (req, res) => {
  const userId = req.user.profileId;
  const likedRoom = await suitableService.getFavoriteOrPassRoom(req.user.id, true);
  // eslint-disable-next-line no-use-before-define
  const numberRoomLiked = likedRoom.length;
  const roomProperties = await roomService.getRoomPropertiesByUserId(userId);
  const userTenant = await userService.getUserById(userId);
  const userQuery = {
    lifestyle: userTenant.lifestyle,
    preferences: userTenant.preferences,
    gender: 'any',
  };
  if (userQuery.preferences.some((element) => element === 'Female only')) userQuery.gender = 'female';
  const listId = await roomService.queryRoomsByAttributes(roomProperties[0], userQuery);

  const listRoomPassByCurrUser = await suitableService.getFavoriteOrPassRoom(req.user.id, false);
  const lastListId = listId[0].filter(
    (element) => element.id !== listRoomPassByCurrUser.roomId && element.id !== likedRoom.roomId
  );
  const listItemWithHomeownerInfor = await Promise.all(
    lastListId.map(async (item) => {
      const user = await userService.getUserById(item.userId);
      const { id, password, isEmailVerified, isContactVerified, createdAt, updatedAt, ...userInfor } = user.toJSON();
      return Object.assign(item, userInfor);
    })
  );
  const numberPage = Math.ceil(lastListId.length / config.paginate.number_item_per_page);
  const paginate = (arr, page_number) => {
    return arr.slice(
      (page_number - 1) * config.paginate.number_item_per_page,
      page_number * config.paginate.number_item_per_page
    );
  };
  const listItem = paginate(listItemWithHomeownerInfor, req.query.page);
  res.status(httpStatus.OK).json({ status: httpStatus.OK, message: 'OK', numberRoomLiked, numberPage, listItem });
});

const likeRoom = catchAsync(async (req, res) => {
  const roomInfor = await roomService.getRoomById(req.body.roomId);
  const roomLiked = await suitableService.likeRoom(req.body.roomId, req.user.id, req.query.liked);
  const userRole = await userService.getRoleById(roomInfor.toJSON().userId);
  const checkChatStatus = await matchingService.getMatching(req.user.id, userRole.toJSON().id);
  let chatStatus = false;
  if (checkChatStatus) {
    if (checkChatStatus.like && !(req.query.liked === 'false')) {
      chatStatus = true;
    }
  }
  const update = await matchingService.updateChatStatus(req.user.id, userRole.toJSON().id, chatStatus);
  const { roomId, createdAt, updatedAt, ...result } = {
    ...roomLiked.toJSON(),
    room: {
      id: roomInfor.id,
      RentalAddress: roomInfor.RentalAddress,
      PicturesVideo: roomInfor.PicturesVideo,
    },
    availableChat: chatStatus,
  };
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', result));
});

const getListFavoriteOrPassRoom = catchAsync(async (req, res) => {
  const listRoomMatchedWithStatus = await suitableService.getFavoriteOrPassRoom(req.user.id, req.query.liked);
  let lisrRoomMatchedDetail = await Promise.all(
    listRoomMatchedWithStatus.map(async (item) => {
      const room = await roomService.getRoomById(item.toJSON().roomId);
      const userRole = await userService.getUserById(room.toJSON().userId);
      const checkChatStatus = await matchingService.getMatching(req.user.id, userRole.toJSON().id);
      let chatStatus = false;
      if (checkChatStatus) {
        if (checkChatStatus.like && !(req.query.liked === 'false')) {
          chatStatus = true;
        }
      }
      return {
        id: item.toJSON().id,
        userId: item.toJSON().userId,
        room: {
          id: room.id,
          RentalAddress: room.RentalAddress,
          PicturesVideo: room.PicturesVideo,
        },
        like: item.toJSON().like,
        availableChat: chatStatus,
      };
    })
  );
  if (req.query.search !== undefined && req.query.search !== '') {
    const listRoomSearchResult = lisrRoomMatchedDetail.filter((item) => {
      return item.room.RentalAddress.toLowerCase().includes(req.query.search.toLowerCase());
    });
    lisrRoomMatchedDetail = [...listRoomSearchResult];
  }
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', lisrRoomMatchedDetail));
});

const getMatchRoomInfor = catchAsync(async (req, res) => {
  const room = await roomService.getRoomById(req.params.id);
  const user = await userService.getUserById(room.toJSON().userId);
  const { id, password, isEmailVerified, isContactVerified, createdAt, updatedAt, ...userInfor } = user.toJSON();
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', Object.assign(room.toJSON(), userInfor)));
});

module.exports = {
  createRoom,
  updateRoom,
  deleteRoomByRoomId,
  getRoomById,
  getRoomByUserId,
  getRoomProperties,
  updateRoomProperties,
  queryRoomsByProperties,
  likeRoom,
  getListFavoriteOrPassRoom,
  getMatchRoomInfor,
};
