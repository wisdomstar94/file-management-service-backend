'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileDownloadUrlAccessConditions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileDownloadUrlAccessConditions.init({
    seq: DataTypes.BIGINT,
    fileAccessConditionKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fileDownloadUrlKey: DataTypes.STRING,
    conditionType: DataTypes.STRING,
    key: DataTypes.STRING,
    value: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    createrUserKey: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    updaterUserKey: DataTypes.STRING,
    conditionStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'FmsFileDownloadUrlAccessConditions',
  });
  return FmsFileDownloadUrlAccessConditions;
};