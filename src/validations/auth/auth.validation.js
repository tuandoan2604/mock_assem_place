const Joi = require('joi');

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    deviceEntity: Joi.object().keys({
      os: Joi.number().optional().allow(null, ''),
      deviceId: Joi.string().optional().allow(null, ''),
      token: Joi.string().optional().allow(null, ''),
    }),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().optional().allow(null, ''),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  login,
  logout,
  refreshTokens,
};
