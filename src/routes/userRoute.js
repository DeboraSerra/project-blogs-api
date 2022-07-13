const { Router } = require('express');
const userController = require('../controllers/userController');

const user = Router();

user.route('/')
  .post(userController.createUser);

module.exports = user;
