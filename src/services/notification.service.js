const dotenv = require('dotenv');
const admin = require('firebase-admin');
const serviceAccount = require('../utils/firebase.json');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

dotenv.config();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const defaultOptions = {
  priority: process.env.FIREBASE_PUSH_PRIORITY || 'normal',
  timeToLive: parseInt(process.env.FIREBASE_PUSH_TIME_TO_LIVE, 10) || 60 * 60 * 24,
};

const sendToDevice = async (registrationTokens, message, options) => {
  const option = options || defaultOptions;
  return admin.messaging().sendToDevice(registrationTokens, { notification: message, data: message }, option);
};

const pushNotification = async (userId, message) => {
  try {
    const users = await User.findByPk(userId);
    await sendToDevice(users.deviceId, message);
    await Notification.create({ userId, message });
  } catch (e) {
    throw new Error(`push notification ${e}`);
  }
};

module.exports = { pushNotification };
