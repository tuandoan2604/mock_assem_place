const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { tenantAuthService, tokenService } = require('../../services/index');
const response = require('../../utils/responseTemp');

const register = catchAsync(async (req, res) => {
  const { idType, user, room } = await tenantAuthService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user, req.body.idType);
  res.send(response(httpStatus.CREATED, 'Register Success', { idType, user, tokens, room }));
});

module.exports = {
  register,
};
