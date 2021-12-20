const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const db = require('./index.js');

const Profile = db.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Username already in use!',
    },
  },
  contact: {
    type: DataTypes.TEXT,
    unique: {
      args: true,
      msg: 'Contact already in use!',
    },
    // validate: {
    //   isMobilePhone: { msg: 'Must be a valid phone number' },
    // },
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Email address already in use!',
    },
    validate: {
      isEmail: { msg: 'Must be a valid email address' },
    },
  },
  address: {
    type: DataTypes.TEXT,
  },
  ageGroup: {
    type: DataTypes.INTEGER,
  },
  dob: {
    type: DataTypes.DATE,
  },
  lifestyle: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  preferences: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
  },
  gender: {
    type: DataTypes.TEXT,
  },
  occupation: {
    type: DataTypes.TEXT,
  },
  nationality: {
    type: DataTypes.TEXT,
  },
  ethnicity: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.TEXT,
  },
  is_representative: {
    type: DataTypes.BOOLEAN,
  },
  rental_account: {
    type: DataTypes.TEXT,
  },
  facebook_account: {
    type: DataTypes.TEXT,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
  },
  isContactVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  agencyName: {
    type: DataTypes.TEXT,
  },
  licenseNumber: {
    type: DataTypes.TEXT,
  },
  salespersonNumber: {
    type: DataTypes.TEXT,
  },
});

Profile.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 8);
});

Profile.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

Profile.prototype.comparePassword = async (password, user) => {
  return bcrypt.compare(password, user.password);
};

Profile.isEmailTaken = async function (email, excludeUserId) {
  const user = await Profile.findOne({ where: { email, id: excludeUserId } });
  return !!user;
};

Profile.isContactTaken = async function (contact, excludeUserId) {
  const user = await Profile.findOne({ where: { contact, id: excludeUserId } });
  return !!user;
};
db.sync();
module.exports = Profile;
