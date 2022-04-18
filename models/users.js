'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Users.hasMany(models.Feeds, { foreignKey: "userCode", });
      Users.hasMany(models.Follows, { foreignKey: "userCode", });
      Users.hasMany(models.Liked, { foreignKey: "userCode" })
    }
  }
  Users.init({
    userCode: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    password: DataTypes.STRING,
    intro: DataTypes.STRING,
    img: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};