'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsJwtRefreshTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsJwtRefreshTokens.init({
    seq: DataTypes.BIGINT,
    jwtRefreshTokenKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userKey: DataTypes.STRING,
    agent: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    endLineDateTime: DataTypes.DATE,
    isDeletedRow: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'FmsJwtRefreshTokens',
  });
  return FmsJwtRefreshTokens;
};