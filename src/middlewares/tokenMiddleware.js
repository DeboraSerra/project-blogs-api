const loginService = require('../services/loginService');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  const joiValid = await loginService.validateToken(token);
  const user = await loginService.verifyToken(joiValid);
  req.user = user;
  next();
};
