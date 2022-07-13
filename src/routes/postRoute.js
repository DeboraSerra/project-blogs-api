const { Router } = require('express');
const postController = require('../controllers/postController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const post = Router();

post.use(tokenMiddleware);

post.route('/')
  .post(postController.createPost)
  .get(postController.getPosts);

module.exports = post;
