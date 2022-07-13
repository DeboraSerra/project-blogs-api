const Joi = require('joi');
const models = require('../database/models');
const Sequelize = require('sequelize');

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
  createPost: async ({ id, title, content, categoryIds }) => {
    const catExists = await Promise.all(
      categoryIds.map((catId) => models.Category
        .findOne({ where: { id: catId } }, { raw: true })),
    );
    if (!catExists.every((item) => item)) {
      const error = new Error('"categoryIds" not found');
      error.statusCode = 400;
      throw error;
    }
    const result = await sequelize.transaction(async (t) => {
      const post = await models.BlogPost.create({
        userId: id, title, content,
      }, { transaction: t, raw: true });
      console.log(post)
      await Promise.all(categoryIds.map((catId) => (
        models.PostCategory.create({ postId: post.null, categoryId: catId }, {
          transaction: t, raw: true,
        })
      )));
      return { ...post.dataValues, id: post.null };
    })
    return result;
  }
}
