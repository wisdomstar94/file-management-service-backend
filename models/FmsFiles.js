'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFiles.init({
    seq: DataTypes.BIGINT,
    fileKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fileLabelName: DataTypes.STRING,
    fileMemo: DataTypes.TEXT,
    fileDescription: DataTypes.TEXT,
    fileStoreVersionHistoryOpen: DataTypes.ENUM(['Y', 'N']),
    fileStoreDescriptionOpen: DataTypes.ENUM(['Y', 'N']),
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    createrUserKey: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    updaterUserKey: DataTypes.STRING,
    fileStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsFiles',
  });
  return FmsFiles;
};