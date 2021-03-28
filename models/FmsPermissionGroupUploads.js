'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsPermissionGroupUploads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsPermissionGroupUploads.init({
    seq: DataTypes.BIGINT,
    permissionGroupUploadKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    permissionGroupKey: DataTypes.STRING,
    permissionKey: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    isActive: DataTypes.ENUM,
    isDeletedRow: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'FmsPermissionGroupUploads',
  });
  return FmsPermissionGroupUploads;
};