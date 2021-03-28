'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsPermissions.init({
    seq: DataTypes.BIGINT,
    menuKey: DataTypes.STRING,
    permissionKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    permissionName: DataTypes.STRING,
    permissionDescription: DataTypes.STRING,
    sortNo: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsPermissions',
  });
  return FmsPermissions;
};