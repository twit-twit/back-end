'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.Users, { foreignKey: { name: "userCode", allowNull: false }, onDelete: "CASCADE", });
      models.Comment.belongsTo(models.Feeds, { foreignKey: { name: "feedCode", allowNull: false }, onDelete: "CASCADE", });
    }
  }
  Comment.init({
    commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
    feedCode: DataTypes.INTEGER,
    userCode: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};