const { DataTypes } = require('sequelize');

const attributes = {
  name: {
    type: DataTypes.STRING
  },
}

/** @param {import('sequelize').Sequelize} sequelize */
module.exports = (sequelize) => {
  const Category = sequelize.define('Category', attributes, {
    timestamps: false,
    tableName: 'Categories'
  })
  return Category;
}
