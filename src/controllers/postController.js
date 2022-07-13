const postService = require('../services/postService');

module.exports = {
  createPost: async (req, res) => {
    const { id } = req.user;
    const validJoi = await postService.validatePost(req.body);
    const post = await postService.createPost({ id, ...validJoi });
    res.status(201).json(post);
  }
}
