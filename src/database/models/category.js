const { DataTypes } = require('sequelize');

const attributes = {
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
  },
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
