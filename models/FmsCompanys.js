'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsCompanys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsCompanys.init({
    seq: DataTypes.BIGINT,
    companyKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    companyName: DataTypes.STRING,
    companyCEOName: DataTypes.STRING,
    companyCEOTel: DataTypes.STRING,
    companyTel: DataTypes.STRING,
    companyBusinessNumber: DataTypes.STRING,
    companyAddress: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    createrUserKey: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    updaterUserKey: DataTypes.STRING,
    companyStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsCompanys',
  });
  return FmsCompanys;
};