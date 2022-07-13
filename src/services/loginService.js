const Joi = require('joi');
const jwt = require('jsonwebtoken');
const models = require('../database/models');

module.exports = {
  validateToken: async (str) => {
    const schema = Joi.string().required();
    const result = schema.validate(str);
    if (result.error) {
      const error = new Error('Token not found');
      error.statusCode = 401;
      throw error;
    }
    return result.value;
  },
  validateLogin: async (obj) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const result = schema.validate(obj);
    if (result.error) {
      const error = new Error('Some required fields are missing');
      error.statusCode = 400;
      throw error;
    }
    return result.value;
  },
  makeToken: async (user) => {
    const payload = { data: user };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  },
  verifyToken: async (token) => {
    const { data } = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  },
  getByEmail: async ({ email, password }) => {
    const user = await models.User.findOne({
      where: { email },
      raw: true,
    });
    if (!user || user.password !== password) {
      const error = new Error('Invalid fields');
      error.statusCode = 400;
      throw error;
    }
    const { password: pass, ...newUser } = user;
    return newUser;
  },
};
