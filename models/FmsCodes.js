'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsCodes.init({
    seq: DataTypes.BIGINT,
    codeGroup: DataTypes.STRING,
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    codeName: DataTypes.STRING,
    codeDescription: DataTypes.STRING,
    codeValue1: DataTypes.STRING,
    codeValue2: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.TINYINT,
    isDeletedRow: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'FmsCodes',
  });
  return FmsCodes;
};