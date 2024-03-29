const { DataTypes } = require('sequelize');

const attributes = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
  published: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updated: {
    allowNull: false,
    type: DataTypes.DATE,
  }
}
/** @param {import('sequelize').Sequelize} sequelize */
module.exports = (sequelize) => {
  const BlogPost = sequelize.define('BlogPost', attributes, {
    tableName: 'BlogPosts',
    timestamps: false,
  });
  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, {
      foreignKey: 'userId', as: 'user',
    })
  }
  return BlogPost;
}
