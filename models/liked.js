'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Liked extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Liked.belongsTo(models.Users, { foreignKey: { name: "userCode", allowNull: false }, onDelete: "CASCADE", });
      models.Liked.belongsTo(models.Feeds, { foreignKey: { name: "feedCode", allowNull: false }, onDelete: "CASCADE", });
    }
  }
  Liked.init({
    likedId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userCode: DataTypes.INTEGER,
    feedCode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Liked',
  });
  return Liked;
};