const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService, emailService, roomService, matchingService } = require('../services');
const response = require('../utils/responseTemp');
const config = require('../config/config');
const { result } = require('lodash');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(response(httpStatus.OK, 'Get All User', result));
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(response(httpStatus.OK, 'Get User By Id', user));
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Delete User Success', null));
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordNumber = Math.floor(Math.random() * 10000);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email, resetPasswordNumber);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordNumber);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Send Email Success', null));
});

const forgotPasswordVerify = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  const tokenDoc = await userService.getRoleById(user.id);
  const tokenPayload = tokenService.verifyTokenSMSAndResetPass(tokenDoc.forgotPassToken);
  if (tokenPayload.code !== req.body.code) res.status(httpStatus.NOT_FOUND).send();
  await userService.updateUserById(user.id, { password: req.body.newPassword });
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Reset Password Success', null));
});

const forgotPasswordVerifyCode = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  const tokenDoc = await userService.getRoleById(user.id);
  const tokenPayload = tokenService.verifyTokenSMSAndResetPass(tokenDoc.forgotPassToken);
  if (tokenPayload.code !== req.body.code)
    res.status(httpStatus.BAD_REQUEST).send(response(httpStatus.BAD_REQUEST, 'Error Code'));
  const tokenResetPass = await tokenService.generateResetPasswordTokenVerify(user.id);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Verify Success, Send Token', { token: tokenResetPass }));
});

const resetPassword = catchAsync(async (req, res) => {
  await userService.resetPassword(req.body.token, req.body.newPassword);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Reset Password Success', null));
});

const updateContactByEmail = catchAsync(async (req, res) => {
  const user = await userService.updateContactUserByEmail(req.body.email, req.body.contact);
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', user));
});

const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.user.profileId, req.body.oldPassword, req.body.newPassword);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Change Password Success', null));
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailCode = Math.floor(Math.random() * 10000);
  await tokenService.generateVerifyEmailToken(req.body.user.email, verifyEmailCode);
  await emailService.sendVerificationEmail(req.body.user.email, verifyEmailCode);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Send Verify Mail Success', null));
});

const verifyEmail = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  const tokenDoc = await userService.getRoleById(user.id);
  const tokenPayload = await userService.verifyEmail(tokenDoc.verifyEmailToken);
  if (tokenPayload.code !== req.body.code)
    res.status(httpStatus.BAD_REQUEST).send(response(httpStatus.BAD_REQUEST, 'Error Code'));
  await userService.updateUserById(user.id, { isEmailVerified: true });
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Verify Success', null));
});

const sendVerificationSMS = catchAsync(async (req, res) => {
  await tokenService.generateSMSToken(req.body.contact);
  res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Send SMS Success', null));
});

const verifySMSCode = catchAsync(async (req, res) => {
  const result = await userService.verifySMSCode(req.body.contact, req.body.code);
  if (result === null) res.status(httpStatus.UNAUTHORIZED).send();
  else {
    res.status(httpStatus.OK).send(response(httpStatus.NO_CONTENT, 'Verify successfully', null));
  }
});

const queryTenantByProperties = catchAsync(async (req, res) => {
  const roomDetailBeforeFormat = await roomService.getRoomById(req.body.roomId);
  let roomDetail = roomDetailBeforeFormat.toJSON();
  const userBeforeFormat = await userService.getUserById(req.user.profileId);
  let user = userBeforeFormat.toJSON();
  const role = await userService.getRoleById(req.user.profileId);
  if (role.idType === 'Homeowner') {
    const userAfterUpdate = await userService.updatePreferencesHomeowner(req.user.profileId, req.body.preferences);
    user = { ...userAfterUpdate.toJSON() };
  } else {
    const roomAfterUpdate = await roomService.updatePreferencesAgent(req.body.roomId, req.body.preferences);
    roomDetail = { ...roomAfterUpdate.toJSON() };
  }
  let gender;
  if (req.body.preferences.some((element) => element === 'Female only')) gender = 'female';
  else gender = 'any';
  const dataQuery = await roomService.queryTenantByAttributes(roomDetail, user, gender, req.body.preferences);
  const listId = dataQuery[0];

  const numberPage = Math.ceil(listId.length / config.paginate.number_item_per_page);
  const paginate = (arr, page_number) => {
    return arr.slice(
      (page_number - 1) * config.paginate.number_item_per_page,
      page_number * config.paginate.number_item_per_page
    );
  };
  const listItem = paginate(listId, req.query.page);
  res.status(httpStatus.OK).json({ status: httpStatus.OK, message: 'OK', numberPage, listItem });
});
const matching = catchAsync(async (req, res) => {
  const infor = await userService.getRoleById(req.body.userId);
  const tenantId = infor.toJSON().id;
  const result = await matchingService.likeOrPassTenant(req.body.roomId, tenantId, req.user.id, req.query.liked);
  const tenantProfile = await userService.getUserById(req.body.userId);
  const { createdAt, updatedAt, ...resultData } = {
    ...result.toJSON(),
    user: {
      name: tenantProfile.name,
      occupation: tenantProfile.occupation,
      image: tenantProfile.image,
    },
  };
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', resultData));
});

const getListMatching = catchAsync(async (req, res) => {
  const listTenantMatchedWithStatus = await matchingService.getLikeOrPassPeople(req.user.id, req.query.liked);
  let lisrTenantMatchedDetail = await Promise.all(
    listTenantMatchedWithStatus.map(async (item) => {
      const tenantRole = await userService.getUserRoleById(item.toJSON().tenantId);
      const tenantProfile = await userService.getUserById(tenantRole.toJSON().profileId);
      return {
        id: item.toJSON().id,
        ownerId: item.toJSON().ownerId,
        tenantId: item.toJSON().tenantId,
        user: {
          name: tenantProfile.name,
          occupation: tenantProfile.occupation,
          image: tenantProfile.image,
        },
        like: item.toJSON().like,
        availableChat: item.toJSON().availableChat,
      };
    })
  );
  if (req.query.search !== undefined && req.query.search !== '') {
    const listTenantSearchResult = lisrTenantMatchedDetail.filter((item) => {
      return item.user.name.toLowerCase().includes(req.query.search.toLowerCase());
    });
    lisrTenantMatchedDetail = [...listTenantSearchResult];
  }
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', lisrTenantMatchedDetail));
});

const getMatchTenantInfor = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  const { password, createdAt, updatedAt, ...result } = user.toJSON();
  res.status(httpStatus.OK).send(response(httpStatus.OK, 'OK', result));
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  forgotPasswordVerify,
  sendVerificationSMS,
  verifySMSCode,
  changePassword,
  forgotPasswordVerifyCode,
  updateContactByEmail,
  queryTenantByProperties,
  matching,
  getListMatching,
  getMatchTenantInfor,
};
