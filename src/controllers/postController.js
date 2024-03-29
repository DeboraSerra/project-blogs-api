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
  getPostById: async (req, res) => {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    res.status(200).json(post);
  },
  deletePost: async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    await postService.deletePost(id, userId);
    res.status(204).end();
  },
  updatePost: async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const JoiValid = await postService.validateUpdatePost(req.body);
    const [post] = await postService.updatePost({ ...JoiValid, id, userId });
    const updatedPost = await postService.getPostById(post);
    res.status(200).json(updatedPost);
  },
  queryPost: async (req, res) => {
    const { q } = req.query;
    const postsId = await postService.queryPost(q);
    const posts = await Promise.all(postsId.map((id) => postService.getPostById(id)));
    res.status(200).json(posts);
  },
};
