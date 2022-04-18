'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Follows.belongsTo(models.Users, { foreignKey: { name: "userCode", allowNull: false }, onDelete: "CASCADE", });
    }
  }
  Follows.init({
    followId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    userCode: DataTypes.INTEGER,
    followUserCode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Follows',
  });
  return Follows;
};