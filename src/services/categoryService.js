const models = require('../database/models');

module.exports = {
  createCat: async (name) => {
    if (!name) {
      const error = new Error('"name" is required');
      error.statusCode = 400;
      throw error;
    }
    const cat = await models.Category.create({ name }, { raw: true });
    console.log(cat);
    return cat;
  },
};
