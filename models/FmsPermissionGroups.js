'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsPermissionGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsPermissionGroups.init({
    seq: DataTypes.BIGINT,
    permissionGroupKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    permissionGroupName: DataTypes.STRING,
    permissionGroupDescription: DataTypes.STRING,
    sortNo: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    permissionGroupStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsPermissionGroups',
  });
  return FmsPermissionGroups;
};