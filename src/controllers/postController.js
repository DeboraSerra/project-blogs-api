const postService = require('../services/postService');

module.exports = {
  createPost: async (req, res) => {
    const { id } = req.user;
    const validJoi = await postService.validatePost(req.body);
    await postService.validateCatIds(validJoi.categoryIds);
    const post = await postService.createPost({ id, ...validJoi });
    res.status(201).json(post);
  },
  getPosts: async (_req, res) => {
    const postsIds = await postService.getPosts();
    const posts = await Promise.all(postsIds.map((id) => postService.getPostById(id)));
    res.status(200).json(posts);
  },
};