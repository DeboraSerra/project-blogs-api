const { Router } = require('express');
const userController = require('../controllers/userController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const user = Router();

user.route('/')
  .post(userController.createUser)
  .get(tokenMiddleware, userController.getUsers);

user.route('/me')
  .delete(tokenMiddleware, userController.deleteUser);

user.route('/:id')
  .get(tokenMiddleware, userController.getById);

module.exports = user;
