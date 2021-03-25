'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsUsers.init({
    seq: DataTypes.BIGINT,
    userKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    userName: DataTypes.STRING, 
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userStatus: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'FmsUsers',
  });
  return FmsUsers;
};