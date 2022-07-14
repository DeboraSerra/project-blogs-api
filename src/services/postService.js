const Joi = require('joi');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const models = require('../database/models');
const config = require('../database/config/config');

const sequelize = new Sequelize(config.development);

const getCategories = async (post) => {
  const categoriesIds = await models.PostCategory.findAll({
    where: { postId: post.id },
    raw: true,
  });
  const categories = await Promise.all(categoriesIds.map(({ categoryId }) => (
    models.Category.findOne({ where: { id: categoryId }, raw: true })
  )));
  return categories;
};

module.exports = {
  validatePost: async (obj) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      categoryIds: Joi.array().required(),
    });
    const result = schema.validate(obj);
    if (result.error) {
      const error = new Error('Some required fields are missing');
      error.statusCode = 400;
      throw error;
    }
    return result.value;
  },
  validateUpdatePost: async (obj) => {
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
    });
    const result = schema.validate(obj);
    if (result.error) {
      const error = new Error('Some required fields are missing');
      error.statusCode = 400;
      throw error;
    }
    return result.value;
  },
  validateCatIds: async (categoryIds) => {
    const catExists = await Promise.all(
      categoryIds.map((catId) => models.Category
        .findOne({ where: { id: catId } }, { raw: true })),
    );
    if (!catExists.every((item) => item)) {
      const error = new Error('"categoryIds" not found');
      error.statusCode = 400;
      throw error;
    }
  },
  createPost: async ({ id, title, content, categoryIds }) => {
    const result = await sequelize.transaction(async (t) => {
      const post = await models.BlogPost.create({
        userId: id, title, content, published: new Date(), updated: new Date(),
      }, { transaction: t, raw: true });
      await Promise.all(categoryIds.map((catId) => (
        models.PostCategory.create({ postId: post.null, categoryId: catId }, {
          transaction: t, raw: true,
        })
      )));
      return { ...post.dataValues, id: post.null };
    });
    return result;
  },
  getPosts: async () => {
    const posts = await models.BlogPost.findAll({ attribute: { include: ['id'] }, raw: true });
    const postsId = posts.map((item) => item.id);
    return postsId;
  },
  getPostById: async (id) => {
    const post = await models.BlogPost.findOne({ where: { id }, raw: true });
    if (!post) {
      const error = new Error('Post does not exist');
      error.statusCode = 404;
      throw error;
    }
    const user = await models.User.findOne({
      where: { id: post.userId },
      raw: true,
      attributes: { exclude: ['password'] },
    });
    const categories = await getCategories(post);
    post.user = user;
    post.categories = categories;
    return post;
  },
  deletePost: async (id, userId) => {
    const post = await models.BlogPost.findOne({ where: { id }, raw: true });
    if (!post) {
      const error = new Error('Post does not exist');
      error.statusCode = 404;
      throw error;
    }
    if (post.userId !== userId) {
      const error = new Error('Unauthorized user');
      error.statusCode = 401;
      throw error;
    }
    await models.PostCategory.destroy({ where: { postId: id } });
    await models.BlogPost.destroy({ where: { id }, raw: true });
    return post;
  },
  updatePost: async ({ title, content, id, userId }) => {
    if (Number(id) !== userId) {
      const error = new Error('Unauthorized user');
      error.statusCode = 401;
      throw error;
    }
    const post = await models.BlogPost.update({
      title, content, updated: new Date(),
    }, {
      where: { id },
      raw: true,
    });
    return post;
  },
  queryPost: async (query) => {
    const posts = await models.BlogPost.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            content: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
    });
    const postsId = posts.map(({ id }) => id);
    return postsId;
  },
};
