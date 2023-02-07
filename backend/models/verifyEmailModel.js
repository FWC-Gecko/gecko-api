const mongoose = require('mongoose');

// const VERIFY_EMAIL_EXPIRE = Number(process.env.VERIFY_EMAIL_EXPIRE) * 60; // seconds

const verifyEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter email'],
  },
  passcode: {
    type: Number,
    required: [true, 'Please enter passcode'],
    min: [100000, 'Passcode must be minimum 100000'],
    max: [999999, 'Passcode must be minimum 999999'],
  },
  // expireAt: {
  //   type: Date,
  //   default: new Date(Date.now() + VERIFY_EMAIL_EXPIRE * 1000),
  //   expires: VERIFY_EMAIL_EXPIRE,
  // },
});

module.exports = mongoose.model('VerifyEmail', verifyEmailSchema);
