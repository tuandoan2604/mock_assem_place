const Joi = require('joi');

const pictureVideo = Joi.object().keys({
  imagePath: Joi.string().optional().allow(null, ''),
  format: Joi.string().optional().allow(null, ''),
});

const createRoom = {
  body: Joi.object().keys({
    roomDesc: Joi.object().keys({
      RentalAddress: Joi.string().required(),
      PlaceType: Joi.string().required(),
      Location: Joi.object().keys({
        Latitude: Joi.number().optional().allow(null, ''),
        Longitude: Joi.number().optional().allow(null, ''),
      }),
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
        homeownerName: Joi.string().optional().allow(null, ''),
        homeownerGender: Joi.string().optional().allow(null, ''),
        homeownerAgeGroup: Joi.string().optional().allow(null, ''),
        homeownerDob: Joi.string().optional().allow(null, ''),
        homeownerCountry: Joi.string().optional().allow(null, ''),
        homeownerOccupation: Joi.string().optional().allow(null, ''),
        homeownerEthnicity: Joi.string().optional().allow(null, ''),
        homeownerLifestyle: Joi.array().optional().allow(null, ''),
        homeownerPreferences: Joi.array().optional().allow(null, ''),
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
      isActive: Joi.bool().optional().allow(null, ''),
      Video: Joi.array().optional().allow(null, ''),
    }),
  }),
};

const updateRoom = {
  body: Joi.object().keys({
    roomDesc: Joi.object().keys({
      RentalAddress: Joi.string().optional().allow(null, ''),
      PlaceType: Joi.string().optional().allow(null, ''),
      Location: Joi.object().keys({
        Latitude: Joi.number().optional().allow(null, ''),
        Longitude: Joi.number().optional().allow(null, ''),
      }),
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
        homeownerName: Joi.string().optional().allow(null, ''),
        homeownerGender: Joi.string().optional().allow(null, ''),
        homeownerAgeGroup: Joi.string().optional().allow(null, ''),
        homeownerDob: Joi.string().optional().allow(null, ''),
        homeownerCountry: Joi.string().optional().allow(null, ''),
        homeownerOccupation: Joi.string().optional().allow(null, ''),
        homeownerEthnicity: Joi.string().optional().allow(null, ''),
        homeownerLifestyle: Joi.array().optional().allow(null, ''),
        homeownerPreferences: Joi.array().optional().allow(null, ''),
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
      isActive: Joi.bool().optional().allow(null, ''),
      Video: Joi.array().optional().allow(null, ''),
    }),
  }),
};

const createRoomProperties = {
  body: Joi.object().keys({
    roomDesc: Joi.object().keys({
      RentalAddress: Joi.string().required(),
      Location: Joi.object().keys({
        Latitude: Joi.number().optional().allow(null, ''),
        Longitude: Joi.number().optional().allow(null, ''),
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
        type: Joi.bool().optional().allow(null, ''),
        value: Joi.array().optional().allow(null, ''),
      }),
      BudgetPrice: Joi.object().keys({
        Min: Joi.number().optional().allow(null, ''),
        Max: Joi.number().optional().allow(null, ''),
      }),
    }),
  }),
};

const updateRoomProperties = {
  body: Joi.object().keys({
    roomDesc: Joi.object().keys({
      RentalAddress: Joi.string().optional().allow(null, ''),
      Location: Joi.object().keys({
        Latitude: Joi.number().optional().allow(null, ''),
        Longitude: Joi.number().optional().allow(null, ''),
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
        type: Joi.bool().optional().allow(null, ''),
        value: Joi.array().optional().allow(null, ''),
      }),
      BudgetPrice: Joi.object().keys({
        Min: Joi.number().optional().allow(null, ''),
        Max: Joi.number().optional().allow(null, ''),
      }),
    }),
  }),
};

module.exports = {
  createRoom,
  updateRoom,
  createRoomProperties,
  updateRoomProperties,
};
