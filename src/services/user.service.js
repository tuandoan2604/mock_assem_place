const httpStatus = require('http-status');
const UserModel = require('../models/profile.model');
const UserRole = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const response = require('../utils/responseTemp');
const index = require('./index');
const { tokenTypes } = require('../config/tokens');
const Token = require('../models/user.model');

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const queryUsers = async (filter, options) => {
//   const users = await UserModel.paginate(filter, options);
//   return users;
// };

/**
 * Get homeowner user by id
 * @param {number} id
 * @returns {Promise<UserModel>}
 */
const getUserById = async (id) => {
  return UserModel.findByPk(id);
};

/**
 * Get userType by userId
 * @param {Number} id
 * @returns {Promise<UserModel>}
 */
const getRoleById = async (id) => {
  return UserRole.findOne({ where: { profileId: id } });
};

/**
 * Update User, forgot Pass token by id
 * @param {Number} id
 * @param token
 * @returns {Promise<Model>}
 */
const updateRoleForgotPassById = async (id, token) => {
  const userRole = await getRoleById(id);
  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  userRole.forgotPassToken = token;
  await userRole.save();
  return userRole;
};
/**
 * Update User, refreshToken by userId
 * @param {Number} id
 * @param token
 * @returns {Promise<Model>}
 */
const updateRoleTokenById = async (id, token, refreshTokenExpires) => {
  const userRole = await getRoleById(id);
  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  userRole.refreshToken = token;
  userRole.expires = refreshTokenExpires;
  await userRole.save();
  return userRole;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  email = email.toLowerCase();
  return UserModel.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {number} userId
 * @param {Object} updateBody
 * @returns {Promise<UserModel>}
 */

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  const currentContact = user.contact;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (currentContact !== updateBody.contact) user.isContactVerified = false;
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update contact user by email
 * @param {string} email
 * @param {string} contact
 * @returns {Promise<UserModel>}
 */

const updateContactUserByEmail = async (email, contact) => {
  const user = await getUserByEmail(email);
  const currentContact = user.contact;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (currentContact !== contact) user.isContactVerified = false;
  user.contact = contact;
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {number} userId
 * @returns {Promise<UserModel>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.destroy();
  return user;
};

/**
 * Get user by contact
 * @param {string} contact
 * @returns {Promise<User>}
 */
const getUserByContact = async (contact) => {
  return UserModel.findOne({ where: { contact } });
};
/**
 * Update Role SMS Token
 * @param {Number} id
 * @param token
 * @returns {Promise<Model>}
 */
const updateRoleSMSToken = async (id, token) => {
  const userRole = await getRoleById(id);
  if (!userRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  userRole.smsToken = token;
  await userRole.save();
  return userRole;
};
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = index.tokenService.verifyTokenSMSAndResetPass(resetPasswordToken);
    // const user = await getUserById(resetPasswordTokenDoc.sub);
    // if (!user) {
    //   throw new Error();
    // }
    await updateUserById(resetPasswordTokenDoc.sub, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Password reset failed, Bad Token');
  }
};

/**
 * Change password
 * @param userId
 * @param {string} newPassword
 * @returns {Promise}
 */
const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (!(await user.comparePassword(oldPassword, user))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The current password is incorrect, please try again');
    }
    await updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Old password does not match');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await index.tokenService.verifyTokenEmail(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Email verification failed');
  }
};

const verifySMSCode = async (contact, code) => {
  try {
    const user = await getUserByContact(contact);
    const tokenDoc = await getRoleById(user.id);
    const tokenPayload = index.tokenService.verifyTokenSMSAndResetPass(tokenDoc.smsToken);
    if (tokenPayload.smsCode !== code) {
      return null;
    }

    user.isContactVerified = true;
    await user.save();
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'SMS verification failed');
  }
};

module.exports = {
  getRoleById,
  updateRoleForgotPassById,
  updateRoleTokenById,
  // queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  updateRoleSMSToken,
  resetPassword,
  verifyEmail,
  verifySMSCode,
  getUserByContact,
  changePassword,
  updateContactUserByEmail,
};
