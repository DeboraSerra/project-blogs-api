const loginService = require('../services/loginService');

module.exports = {
  getLogin: async (req, res) => {
    const { email, password } = req.body;
    const joiValid = await loginService.validateLogin({ email, password });
    const userByEmail = await loginService.getByEmail(joiValid);
    const token = await loginService.makeToken(userByEmail);
    res.status(200).json({ token });
  },
};
