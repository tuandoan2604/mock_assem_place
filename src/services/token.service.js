const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const TokenModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {string} email
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate token
 * @param {string} email
 * @param resetPassNumber
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateTokenResetPass = (email, resetPassNumber, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: email,
    code: resetPassNumber,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Verify token reset pass & sms
 * @param token
 * @param {string} [secret]
 * @returns {string}
 */
const verifyTokenSMSAndResetPass = (token, secret = config.jwt.secret) => {
  if (!token) {
    throw new Error('Token not found');
  }
  return jwt.verify(token, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param idType
 * @param {boolean} [is_active]
 * @param forgoPassToken
 * @param faceBookToken
 * @param gmailToken
 * @returns {Promise<Token>}
 */
const saveToken = async (
  userId,
  token,
  expires,
  idType,
  is_active = true,
  forgoPassToken = null,
  faceBookToken = null,
  gmailToken = null
) => {
  const tokenDoc = await TokenModel.create({
    profileId: userId,
    refreshToken: token,
    expires: expires.toDate(),
    idType,
    is_active,
    forgoPassToken,
    faceBookToken,
    gmailToken,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param id_type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await TokenModel.findOne({
    where: { refreshToken: token, profileId: payload.sub, is_active: true },
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Verify token reset pass and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param id_type
 * @returns {Promise<Token>}
 */
const verifyTokenResetPass = async (token, idType) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await TokenModel.findOne({
    where: { resetPassToken: token, idType, id: payload.sub, is_active: true },
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Verify token verify email and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param id_type
 * @returns {Promise<Token>}
 */
const verifyTokenEmail = async (token, idType) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await TokenModel.findOne({
    where: { verifyEmailToken: token, idType, id: payload.sub, is_active: true },
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @param idType
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user, idType) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationDay, 'day');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  const userRole = await userService.getRoleById(user.id);
  if (!userRole) {
    await saveToken(user.id, refreshToken, refreshTokenExpires, idType);
  } else {
    await userService.updateRoleTokenById(user.id, refreshToken, refreshTokenExpires);
  }
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @param resetPasswordNumber
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email, resetPasswordNumber) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateTokenResetPass(email, resetPasswordNumber, expires, tokenTypes.RESET_PASSWORD);
  await userService.updateRoleForgotPassById(user.id, resetPasswordToken);
  return resetPasswordToken;
};

/**
 * Generate reset password token after verify
 * @param {number} userId
 * @returns {Promise<string>}
 */
const generateResetPasswordTokenVerify = async (userId) => {
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  return generateToken(userId, expires, tokenTypes.RESET_PASSWORD);
};

/**
 * Generate verify email token
 * @param email
 * @param verifyEmailCode
 */
const generateVerifyEmailToken = async (email, verifyEmailCode) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  } else if (user.isEmailVerified === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is verified');
  }
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateTokenResetPass(email, verifyEmailCode, expires, tokenTypes.VERIFY_EMAIL);
  // await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  await userService.updateRoleVerifyEmailById(user.id, verifyEmailToken);
  return verifyEmailToken;
};

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {string} email
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateTokenSMS = (userId, expires, type, smsCode, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    smsCode,
    type,
  };
  return jwt.sign(payload, secret);
};
/**
 * Generate sms token
 * @param {string} contact
 * @returns {Promise<string>}
 */
const generateSMSToken = async (contact) => {
  const user = await userService.getUserByContact(contact);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this contact');
  }
  const smsCode = '1111';
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const smsToken = generateTokenSMS(user.id, expires, tokenTypes.VERIFY_SMS, smsCode);
  await userService.updateRoleSMSToken(user.id, smsToken);
  return smsToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyTokenResetPass,
  verifyTokenEmail,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  verifyTokenSMSAndResetPass,
  generateSMSToken,
  verifyToken,
  generateResetPasswordTokenVerify,
};
