const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const cat = Router();

cat.route('/')
  .post(tokenMiddleware, categoryController.createCat);

module.exports = cat;
