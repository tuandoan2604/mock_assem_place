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
      contact: Joi.string().optional().allow(null, ''),
      gender: Joi.string().optional().allow(null, ''),
      ageGroup: Joi.number().optional().allow(null, ''),
      dob: Joi.date().optional().allow(null, ''),
      nationality: Joi.string().optional().allow(null, ''),
      lifestyle: Joi.array().optional().allow(null, ''),
      preferences: Joi.array().optional().allow(null, ''),
      role: Joi.string().optional().allow(null, ''),
      occupation: Joi.string().optional().allow(null, ''),
      ethnicity: Joi.string().optional().allow(null, ''),
      agencyName: Joi.string().optional().allow(null, ''),
      licenseNumber: Joi.string().optional().allow(null, ''),
      salespersonNumber: Joi.string().optional().allow(null, ''),
    }),
    roomDesc: Joi.object().keys({
      RentalAddress: Joi.string().required(),
      Location: Joi.object().keys({
        Latitude: Joi.number().optional().allow(null, ''),
        Longitude: Joi.number().optional().allow(null, ''),
      }),
      PlaceType: Joi.string().required(),
      RoomDetails: Joi.object().keys({
        RoomType: Joi.string().optional().allow(null, ''),
        BedroomNumber: Joi.string().optional().allow(null, ''),
        BathroomNumber: Joi.string().optional().allow(null, ''),
        AttachedBathroom: Joi.bool().optional().allow(null, ''),
        StayWithGuest: Joi.bool().optional().allow(null, ''),
        AllowCook: Joi.bool().optional().allow(null, ''),
        KeyWords: Joi.array().optional().allow(null, ''),
        buildYear: Joi.string().optional().allow(null, ''),
        floorLevel: Joi.string().optional().allow(null, ''),
        floorSizeMax: Joi.number().optional().allow(null, ''),
        floorSizeMin: Joi.number().optional().allow(null, ''),
        roomFurnished: Joi.string().optional().allow(null, ''),
      }),
      LeasePeriod: Joi.object().keys({
        type: Joi.bool().optional().allow(null, ''),
        value: Joi.array().optional().allow(null, ''),
      }),
      PicturesVideo: Joi.array().optional().items(pictureVideo),
      RentalPrice: Joi.object().keys({
        type: Joi.string().optional().allow(null, ''),
        Min: Joi.number().optional().allow(null, ''),
        Max: Joi.number().optional().allow(null, ''),
        Price: Joi.number().optional().allow(null, ''),
      }),
      BudgetPrice: Joi.object().keys({
        Min: Joi.number().optional().allow(null, ''),
        Max: Joi.number().optional().allow(null, ''),
      }),
      Video: Joi.array().optional().allow(null, ''),
    }),
    deviceEntity: Joi.object().keys({
      os: Joi.number().optional(),
      deviceId: Joi.string().empty('').optional().allow(null, ''),
      token: Joi.string().empty('').optional().allow(null, ''),
    }),
  }),
};

module.exports = {
  register,
};
