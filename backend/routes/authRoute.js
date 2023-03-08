const express = require('express');
const {
  loginUser,
  signupUser,
  logoutUser,
  verifyUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  deleteProfile,
  sendPasscodeByEmail,
  updateWallet,
  updateAvatar,
} = require('../controllers/authController');

const { isAuthenticated } = require('../middlewares/auth');
const validation = require('../middlewares/validation');

const { uploadAvatar } = require('../utils/awsFunctions');

const {
  signupUserValidation,
  loginUserValidation,
  sendPasscodeByEmailValidation,
  verifyUserValidation,
} = require('../validations/authValidation');

const router = express();

//  Sign up
router.route('/signup', ...signupUserValidation, validation).post(signupUser);
//  Log in
router.route('/login', ...loginUserValidation, validation).post(loginUser);
//  Log out
router.route('/logout').get(logoutUser);
//  Verify Email
router
  .route('/verify/confirm', ...verifyUserValidation, validation)
  .post(verifyUser);
//  Send passcode by email
router
  .route('/verify/request', ...sendPasscodeByEmailValidation, validation)
  .post(sendPasscodeByEmail);

router
  .route('/me')
  //  Get profile
  .get(isAuthenticated, getProfile)
  //  Update profile
  .put(isAuthenticated, updateProfile)
  //  Delete profile
  .delete(isAuthenticated, deleteProfile);

//  Update Avatar
router
  .route('/me/avatar')
  .put(isAuthenticated, uploadAvatar.single('avatar'), updateAvatar);

//  Update the password
router.route('/password/update').put(isAuthenticated, updatePassword);

//  Forgot a password
router.route('/password/forgot').post(forgotPassword);
//  Reset a password
router.route('/password/reset/:token').put(resetPassword);

//  Update the wallet address
router.route('/wallet/update').put(isAuthenticated, updateWallet);

module.exports = router;
