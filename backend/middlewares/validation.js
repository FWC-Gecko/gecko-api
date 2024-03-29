const { validationResult } = require('express-validator');

const catchAsync = require('./catchAsync');

const { deleteFile } = require('../utils/awsFunctions');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const validation = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file && req.file.location) await deleteFile(req.file.location);
    return res.status(400).json({
      success: false,
      message: errors
        .array()
        .map((error) => capitalize(error.param) + ' ' + error.msg)
        .join(', '),
    });
  }
  next();
});

module.exports = validation;
