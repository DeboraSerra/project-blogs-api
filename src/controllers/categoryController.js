const categoryService = require('../services/categoryService');

module.exports = {
  createCat: async (req, res) => {
    const { name } = req.body;
    const cat = await categoryService.createCat(name);
    res.status(201).json(cat);
  },
  getCats: async (_req, res) => {
    const cats = await categoryService.getCats();
    res.status(200).json(cats);
  },
};
