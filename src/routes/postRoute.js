const { Router } = require('express');
const postController = require('../controllers/postController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const post = Router();

post.use(tokenMiddleware);

post.route('/')
  .post(postController.createPost)
  .get(postController.getPosts);

post.route('/search')
  .get(postController.queryPost);

post.route('/:id')
  .get(postController.getPostById)
  .delete(postController.deletePost)
  .put(postController.updatePost);

module.exports = post;
