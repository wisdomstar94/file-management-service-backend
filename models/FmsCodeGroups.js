'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsCodeGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsCodeGroups.init({
    seq: DataTypes.BIGINT,
    codeGroup: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    codeGroupName: DataTypes.STRING,
    codeGroupDescription: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.TINYINT,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsCodeGroups',
  });
  return FmsCodeGroups;
};