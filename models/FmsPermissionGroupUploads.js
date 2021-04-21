'use strict';
const {
  Model
} = require('sequelize');
// const db = require('./index');
const FmsUsers = require('./FmsUsers');
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

    static async isActivePermission(userKey, permissionKey) {
      const userInfo = await FmsUsers.findOne({
        where: {
          userKey: userKey,
        },
      });

      if (userInfo === null) {
        return false;
      }

      const permissionGroupUploadInfo = await this.findOne({
        where: {
          permissionGroupKey: userInfo.permissionGroupKey,
          permissionKey: permissionKey,
          isActive: 'Y',
          isDeletedRow: 'N',
        },
      });

      if (permissionGroupUploadInfo === null) {
        return false;
      }

      return true;
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
    isActive: DataTypes.ENUM(['Y', 'N']),
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsPermissionGroupUploads',
    updatedAt: false,
    createdAt: false,
  });
  return FmsPermissionGroupUploads;
};