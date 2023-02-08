const { body } = require('express-validator');

const { Role } = require('../constants/enum');

//  Unit validations
const stringValidation = (name) => [
  body(name)
    .exists()
    .withMessage('Not Existed')
    .bail()
    .notEmpty()
    .withMessage('Empty')
    .bail()
    .isString()
    .withMessage('Not String'),
];

const emailValidation = () => [
  body('email')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isEmail()
    .withMessage('Not Email'),
  ...stringValidation('password'),
];

const roleValidation = () => [
  body('role')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isIn(Object.keys(Role))
    .withMessage('Not Matched'),
];
//  Main validations

const signupUserValidation = [
  ...stringValidation('firstname'),
  ...stringValidation('lastname'),
  ...emailValidation(),
  ...roleValidation(),
];

const loginUserValidation = [
  ...emailValidation(),
  ...stringValidation('password'),
  ...roleValidation(),
];

const sendPasscodeByEmailValidation = [...emailValidation()];

const verifyUserValidation = [
  ...emailValidation(),
  body('passcode')
    .exists()
    .withMessage('Not Existed')
    .bail()
    .isInt({ min: 100000, max: 999999 })
    .withMessage('Not Integer Or Out Of Range'),
];

module.exports = {
  signupUserValidation,
  loginUserValidation,
  sendPasscodeByEmailValidation,
  verifyUserValidation,
};
