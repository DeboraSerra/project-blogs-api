const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const cat = Router();

cat.use(tokenMiddleware);

cat.route('/')
  .post(categoryController.createCat)
  .get(categoryController.getCats);

module.exports = cat;
