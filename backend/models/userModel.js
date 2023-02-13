const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Role } = require('../constants/enum');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be of minimum 6 characters'],
    select: false,
  },
  avatar: {
    type: String,
    default: process.env.DEFAULT_USER_AVATAR,
  },
  displayName: {
    type: String,
  },
  birthday: {
    type: String,
  },
  biography: {
    type: String,
  },
  wallet: {
    type: String,
  },
  website: {
    type: String,
  },
  role: {
    type: String,
    enum: Object.keys(Role),
    required: true,
  },
  communityFollow: {
    type: Boolean,
    required: true,
    default: false,
  },

  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
