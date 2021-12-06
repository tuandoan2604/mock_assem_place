const Joi = require('joi');
const { password } = require('../custom.validation');

const pictureVideo = Joi.object().keys({
  imagePath: Joi.string().optional().allow(null, ''),
  format: Joi.string().optional().allow(null, ''),
});

const register = {
  body: Joi.object().keys({
    idType: Joi.string().required(),
    userInfor: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      name: Joi.string().required(),
      contact: Joi.string().optional(),
      gender: Joi.string().optional(),
      ageGroup: Joi.number().optional(),
      dob: Joi.date().optional(),
      nationality: Joi.string().optional(),
      lifestyle: Joi.array().optional(),
      preferences: Joi.array().optional(),
      role: Joi.string().optional(),
      occupation: Joi.string().optional(),
      ethnicity: Joi.string().optional(),
      agencyName: Joi.string().optional(),
      licenseNumber: Joi.string().optional(),
      salespersonNumber: Joi.string().optional(),
    }),
    roomDesc: Joi.object().keys({
      RentalAddress: Joi.string().required(),
      Location: Joi.object().keys({
        Latitude: Joi.number().optional(),
        Longitude: Joi.number().optional(),
      }),
      PlaceType: Joi.array().required(),
      RoomProperty: Joi.object().keys({
        RoomType: Joi.string().optional().allow(null, ''),
        BedroomNumber: Joi.array().optional().allow(null, ''),
        BathroomNumber: Joi.array().optional().allow(null, ''),
        AttachedBathroom: Joi.string().optional().allow(null, ''),
        StayWithGuest: Joi.bool().optional().allow(null, ''),
        AllowCook: Joi.bool().optional().allow(null, ''),
        KeyWords: Joi.array().optional().allow(null, ''),
      }),
      LeasePeriod: Joi.object().keys({
        type: Joi.bool().optional(),
        value: Joi.array().optional(),
      }),
      PicturesVideo: Joi.array().optional().items(pictureVideo),
      RentalPrice: Joi.object().keys({
        type: Joi.string().optional(),
        Min: Joi.number().optional(),
        Max: Joi.number().optional(),
        Price: Joi.number().optional(),
      }),
      BudgetPrice: Joi.object().keys({
        Min: Joi.number().optional(),
        Max: Joi.number().optional(),
      }),
      Video: Joi.array().optional(),
    }),
    deviceEntity: Joi.object().keys({
      os: Joi.number().optional(),
      deviceId: Joi.string().empty('').optional(),
      token: Joi.string().empty('').optional(),
    }),
  }),
};

module.exports = {
  register,
};
