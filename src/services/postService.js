const Joi = require('joi');
const Sequelize = require('sequelize');
const models = require('../database/models');
const config = require('../database/config/config');

const sequelize = new Sequelize(config.development);

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
    const categoriesIds = await models.PostCategory.findAll({
      where: { postId: post.id },
      raw: true,
    });
    const categories = await Promise.all(categoriesIds.map(({ categoryId }) => (
      models.Category.findOne({ where: { id: categoryId }, raw: true })
    )));
    post.user = user;
    post.categories = categories;
    return post;
  },
};
