const { Router } = require('express');
const userController = require('../controllers/userController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const user = Router();

user.route('/')
  .post(userController.createUser)
  .get(tokenMiddleware, userController.getUsers);

user.route('/:id')
  .get(tokenMiddleware, userController.getById);

module.exports = user;
