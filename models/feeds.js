'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feeds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Feeds.belongsTo(models.User, { foreignKey: { name: "userCode", allowNull: false }, onDelete: "CASCADE", });
    }
  }
  Feeds.init({
    userCode: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Feeds',
  });
  return Feeds;
};