const categoryService = require('../services/categoryService');

module.exports = {
  createCat: async (req, res) => {
    const { name } = req.body;
    const cat = await categoryService.createCat(name);
    res.status(201).json(cat);
  },
};
