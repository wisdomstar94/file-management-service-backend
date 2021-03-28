'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsMenuCategorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsMenuCategorys.init({
    seq: DataTypes.BIGINT,
    menuCategoryKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    menuCategoryName: DataTypes.STRING,
    menuCategoryDescription: DataTypes.STRING,
    sortNo: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    menuCategoryStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsMenuCategorys',
  });
  return FmsMenuCategorys;
};