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
      models.Feeds.belongsTo(models.Users, { foreignKey: { name: "userCode", allowNull: false }, onDelete: "CASCADE", });
    }
  }
  Feeds.init({
    feedCode: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userCode: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Feeds',
  });
  return Feeds;
};