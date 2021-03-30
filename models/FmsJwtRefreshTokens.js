'use strict';
const {
  Model, Op
} = require('sequelize');
const myDate = require('../routes/librarys/myDate');
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

    static async getKeyInfo(jwtRefreshTokenKey) {
      const result = await this.findOne({ 
        where: { 
          jwtRefreshTokenKey: jwtRefreshTokenKey, 
          endLineDateTime: {
            [Op.gt]: myDate().format('YYYY-MM-DD HH:mm:ss'),
          },
          isDeletedRow: 'N',
        }, 
      });
      return result;
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
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsJwtRefreshTokens',
    updatedAt: false,
    createdAt: false,
  });
  return FmsJwtRefreshTokens;
};