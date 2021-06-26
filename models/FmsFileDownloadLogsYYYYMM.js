'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileDownloadLogsYYYYMM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileDownloadLogsYYYYMM.init({
    seq: DataTypes.BIGINT,
    downloadLogKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    downloadTargetUserKey: DataTypes.STRING,
    fileDownloadUrlKey: DataTypes.STRING,
    fileVersionKey: DataTypes.STRING,
    userIdLogAt: DataTypes.STRING,
    fileLabelNameLogAt: DataTypes.STRING,
    fileVersionCodeLogAt: DataTypes.INTEGER,
    fileVersionNameLogAt: DataTypes.STRING,
    fileOriginalNameLogAt: DataTypes.STRING,
    fileDownloadNameLogAt: DataTypes.STRING,
    fileSizeLogAt: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsFileDownloadLogsYYYYMM',
    tableName: 'FmsFileDownloadLogsYYYYMM',
    updatedAt: false,
    createdAt: false,
  });
  return FmsFileDownloadLogsYYYYMM;
};