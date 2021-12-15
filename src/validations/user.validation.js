const Joi = require('joi');
const { password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().optional().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().optional().email().allow(null, ''),
      name: Joi.string().optional().allow(null, ''),
      contact: Joi.string().optional().allow(null, ''),
      gender: Joi.string().allow('').optional(),
      ageGroup: Joi.number().optional().allow(null, ''),
      nationality: Joi.string().allow('').optional(),
      lifestyle: Joi.array().optional().allow(null, ''),
      preferences: Joi.array().optional().allow(null, ''),
      role: Joi.string().optional().allow(null, ''),
      dob: Joi.date().optional().allow(null),
      image: Joi.string().optional().allow(null, ''),
      occupation: Joi.string().allow('').optional(),
      ethnicity: Joi.string().allow('').optional(),
      agencyName: Joi.string().optional().allow(null, ''),
      licenseNumber: Joi.string().optional().allow(null, ''),
      salespersonNumber: Joi.string().optional().allow(null, ''),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.number().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    newPassword: Joi.string().required().custom(password),
    oldPassword: Joi.string().required(),
  }),
};

const updateContactByEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    contact: Joi.string().required(),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  resetPassword,
  verifyEmail,
  forgotPassword,
  changePassword,
  updateContactByEmail,
};
