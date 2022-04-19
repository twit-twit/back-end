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
      console.log(models)
      // Feeds.belongsTo(models.Users, { foreignKey: "userCode", onDelete: "CASCADE", });
      Feeds.hasMany(models.Liked, { foreignKey: "feedCode" })
      Feeds.hasMany(models.Comment, { foreignKey: "feedCode" })
      models.Feeds.belongsTo(models.Users, { foreignKey: { name: "userCode", allowNull: false }, onDelete: "CASCADE", });
    }
  }
  Feeds.init({
    feedCode: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userCode: DataTypes.INTEGER,
    content: DataTypes.STRING,
    feedUrl: DataTypes.STRING,
    feedImage: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Feeds',
  });
  return Feeds;
};