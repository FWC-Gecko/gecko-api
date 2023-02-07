const sendToken = (user, statusCode, res) => {
  const token = user.generateToken();
  return res.status(statusCode).json({
    success: true,
    token,
  });
};

module.exports = sendToken;
