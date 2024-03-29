const userService = require('../services/userService');
const loginService = require('../services/loginService');

module.exports = {
  createUser: async (req, res) => {
    const joiValid = await userService.validateUser(req.body);
    console.log(joiValid);
    const user = await userService.createUser(joiValid);
    const token = await loginService.makeToken(user);
    res.status(201).json({ token });
  },
  getUsers: async (_req, res) => {
    const users = await userService.getUsers();
    res.status(200).json(users);
  },
  getById: async (req, res) => {
    const { id } = req.params;
    const user = await userService.getById(id);
    res.status(200).json(user);
  },
  deleteUser: async (req, res) => {
    const { id } = req.user;
    await userService.deleteUser(id);
    req.user = '';
    res.status(204).end();
  },
};
