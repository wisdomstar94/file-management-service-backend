'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileDownloadUrls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileDownloadUrls.init({
    seq: DataTypes.BIGINT,
    fileDownloadUrlKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    downloadTargetUserKey: DataTypes.STRING,
    fileKey: DataTypes.STRING,
    fileVersionKey: DataTypes.STRING,
    fileDownloadUrlAccessCount: DataTypes.BIGINT,
    fileDownloadPossibleDateTimeStart: DataTypes.DATE,
    fileDownloadPossibleDateTimeEnd: DataTypes.DATE,
    fileDownloadLimitMaxCount: DataTypes.INTEGER,
    fileDownloadCount: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    createrUserKey: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    updaterUserKey: DataTypes.STRING,
    fileDownloadUrlStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsFileDownloadUrls',
  });
  return FmsFileDownloadUrls;
};