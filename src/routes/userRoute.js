const { Router } = require('express');
const userController = require('../controllers/userController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const user = Router();

user.route('/')
  .post(userController.createUser)
  .get(tokenMiddleware, userController.getUsers);

module.exports = user;
