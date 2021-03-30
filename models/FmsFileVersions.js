'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileVersions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileVersions.init({
    seq: DataTypes.BIGINT,
    fileVersionKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fileKey: DataTypes.STRING,
    fileVersionName: DataTypes.STRING,
    fileVersionCode: DataTypes.INTEGER,
    fileOriginalName: DataTypes.STRING,
    fileDownloadName: DataTypes.STRING,
    fileVersionMemo: DataTypes.TEXT,
    fileVersionDescription: DataTypes.TEXT,
    filePath: DataTypes.STRING,
    createrUserKey: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updaterUserKey: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    fileVersionStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsFileVersions',
    updatedAt: false,
    createdAt: false,
  });
  return FmsFileVersions;
};