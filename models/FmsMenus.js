'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsMenus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsMenus.init({
    seq: DataTypes.BIGINT,
    parentMenuKey: DataTypes.STRING,
    menuCategoryKey: DataTypes.STRING,
    menuKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    menuName: DataTypes.STRING,
    menuDescription: DataTypes.STRING,
    sortNo: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    menuStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsMenus',
    updatedAt: false,
    createdAt: false,
  });
  return FmsMenus;
};