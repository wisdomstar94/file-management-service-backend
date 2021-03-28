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
    companyKey: DataTypes.STRING,
    permissionGroupKey: DataTypes.STRING,
    userId: DataTypes.STRING,
    userPassword: DataTypes.TEXT,
    userName: DataTypes.STRING,
    userPhone: DataTypes.STRING,
    userMemo: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    userStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsUsers',
  });
  return FmsUsers;
};