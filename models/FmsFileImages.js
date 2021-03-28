'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileImages.init({
    seq: DataTypes.BIGINT,
    fileImageKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fileKey: DataTypes.STRING,
    fileImageOriginalName: DataTypes.STRING,
    filePath: DataTypes.STRING,
    fileAccessUrl: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    fileImageStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsFileImages',
  });
  return FmsFileImages;
};