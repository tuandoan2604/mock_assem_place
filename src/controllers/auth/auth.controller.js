const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { authService, userService, tokenService, deviceService } = require('../../services');
const response = require('../../utils/responseTemp');

const login = catchAsync(async (req, res) => {
  const { email, password, ...deviceEntity } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const [userType, device] = [
    await userService.getRoleById(user.id),
    await deviceService.updateDeviceByDeviceId(deviceEntity.deviceId),
  ];
  const tokens = await tokenService.generateAuthTokens(user, userType.idType);
  res.send(response(httpStatus.OK, 'Login Success', { tokens, device, role: userType }));
});

const getUserInfor = catchAsync(async (req, res) => {
  const id = req.user.profileId;
  if (!id) res.send(response(httpStatus.UNAUTHORIZED, 'unauthorized'));
  const user = await userService.getUserById(id);
  const role = await userService.getRoleById(id);
  res.json({ status: httpStatus.OK, message: 'OK', role, user });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user);
  res.status(httpStatus.NO_CONTENT).send(response(httpStatus.NO_CONTENT, 'Logout Success', null));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send(response(httpStatus.OK, 'Refresh Token Success', { ...tokens }));
});

module.exports = {
  login,
  logout,
  refreshTokens,
  getUserInfor,
};
