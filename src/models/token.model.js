// const { Model, DataTypes, Sequelize } = require('sequelize');
// const db = require('./index.js');
// const UserModel = require('./user.model');
// // const { toJSON } = require('./plugins');
// // const { tokenTypes } = require('../config/tokens');

// const Token = db.define('Token', {
//   id_token: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   user: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   token: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   type: {
//     type: DataTypes.TEXT
//   },
//   expires: {
//     type: DataTypes.DATE
//   },
//   blacklisted: {
//     type: DataTypes.BOOLEAN
//   }
// });

// Token.belongsTo(UserModel, {foreignKey: 'user', targetKey: 'id'});

// db.sync();
// module.exports = Token;

// const tokenSchema = mongoose.Schema(
//   {
//     token: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     user: {
//       type: mongoose.SchemaTypes.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     type: {
//       type: String,
//       enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
//       required: true,
//     },
//     expires: {
//       type: Date,
//       required: true,
//     },
//     blacklisted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // add plugin that converts mongoose to json
// tokenSchema.plugin(toJSON);

// /**
//  * @typedef Token
//  */
// const Token = mongoose.model('Token', tokenSchema);

// module.exports = Token;
