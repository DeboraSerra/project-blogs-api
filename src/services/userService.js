const Joi = require('joi');
const models = require('../database/models');

module.exports = {
  validateUser: async (obj) => {
    const schema = Joi.object({
      displayName: Joi.string().min(8),
      email: Joi.string().email(),
      password: Joi.string().min(6),
      image: Joi.string(),
    });
    const result = schema.validate(obj);
    if (result.error) {
      const error = new Error(result.error.message);
      error.statusCode = 400;
      throw error;
    }
    return result.value;
  },
  createUser: async ({ displayName, email, password, image }) => {
    const exists = await models.User.findOne({
      where: { email },
      raw: true,
    });
    if (exists) {
      const error = new Error('User already registered');
      error.statusCode = 409;
      throw error;
    }
    const user = await models.User.create({ displayName, email, password, image }, {
      raw: true,
    });
    const { password: pass, ...newUser } = user;
    return newUser;
  },
  getUsers: async () => {
    const users = await models.User.findAll({
      raw: true,
      attributes: {
        exclude: ['password'],
      },
    });
    return users;
  },
  getById: async (id) => {
    const user = await models.User.findOne({
      where: { id },
      raw: true,
    });
    if (!user) {
      const error = new Error('User does not exist');
      error.statusCode = 404;
      throw error;
    }
    const { password, ...newUser } = user;
    return newUser;
  },
};
