const crypto = require('crypto');

const User = require('../models/userModel');
const VerifyEmail = require('../models/verifyEmailModel');

const catchAsync = require('../middlewares/catchAsync');

const generateCode = require('../utils/generateCode');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const { deleteFile } = require('../utils/awsFunctions');
const { Role } = require('../constants/enum');

// Signup User
exports.signupUser = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  let email = req.body.email.toLowerCase();

  const user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler('Email Already Exists', 401));
  }

  const newUser = await User.create({
    userName,
    email,
    password,
    role: Role.Customer,
  });

  res.status(200).json({
    success: true,
    message: 'Signed Up',
  });
  // sendToken(newUser, 201, res);
});

// Login User
exports.loginUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  let email = req.body.email.toLowerCase();

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler("User Doesn't Exist", 404));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password Doesn't Match", 401));
  }

  if (!user.verified) {
    return next(new ErrorHandler('Must Be Verified By Email', 401));
  }

  sendToken(user, 201, res);
});

// Logout User
exports.logoutUser = catchAsync(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

exports.sendPasscodeByEmail = catchAsync(async (req, res, next) => {
  let email = req.body.email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Email Doesn't Exist", 404));
  }

  //  Generate a new passcode
  const passcode = generateCode();

  try {
    // Send email with passcode
    await sendEmail({
      email,
      templateId: process.env.SENDGRID_VERIFY_TEMPLATEID,
      data: {
        passcode,
      },
    });

    await VerifyEmail.updateOne(
      { email },
      { $set: { passcode } },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Passcode is sent',
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//  Verify user with email and passcode
exports.verifyUser = catchAsync(async (req, res, next) => {
  const { passcode } = req.body;

  let email = req.body.email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Email Doesn't Exist", 404));
  }

  const verifyEmail = await VerifyEmail.findOne({ email });

  if (!verifyEmail) {
    return next(new ErrorHandler('Passcode Already Expired', 401));
  }

  if (verifyEmail.passcode != passcode) {
    return next(new ErrorHandler('Passcode Wrong', 401));
  }

  await VerifyEmail.deleteOne({ email });

  res.status(200).json({
    success: true,
    message: 'Email Verified',
  });
});

// Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Old Password', 401));
  }

  user.password = password;
  await user.save();
  sendToken(user, 201, res);
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { displayName, userName, biography, birthday, website } = req.body;

  await User.findByIdAndUpdate(req.user._id, {
    displayName,
    userName,
    biography,
    birthday,
    website,
  });

  res.status(200).json({
    success: true,
    message: 'Profile Updated',
  });
});

exports.deleteProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // delete post & user images ⚠️⚠️
  if (user.avatar != process.env.DEFAULT_USER_AVATAR)
    await deleteFile(user.avatar);

  await user.remove();

  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile Deleted',
  });
});

// Forgot Password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });

  if (!user) {
    return next(new ErrorHandler('User Not Found', 404));
  }

  const resetPasswordToken = await user.getResetPasswordToken();

  await user.save();

  const resetPasswordUrl = `https://${req.get(
    'host'
  )}/password/reset/${resetPasswordToken}`;

  try {
    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: {
        reset_url: resetPasswordUrl,
      },
    });

    res.status(200).json({
      success: true,
      message: `Email Sent To ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('User Not Found', 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'The Password Reset',
  });
});

exports.updateWallet = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { wallet: req.body.wallet });

  res.status(200).json({
    success: true,
    message: 'Wallet Updated',
  });
});
