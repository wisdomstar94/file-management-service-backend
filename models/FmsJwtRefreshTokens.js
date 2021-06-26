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
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    jwtRefreshTokenKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: 'JWT 리프레쉬 토큰 고유 식별키',
    },
    userKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '회원 고유 식별키',
      // FK
    },
    agent: {
      type: DataTypes.STRING(300),
      allowNull: false,
      comment: '리프레시 토큰 발급 당시 클라이언트로부터 온 헤더의 user-agent 값',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '생성일',
    },
    createdIp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      comment: '생성시 요청 IP',
    },
    endLineDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '토큰 유효 만료 날짜',
    },
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsJwtRefreshTokens',
    tableName: 'FmsJwtRefreshTokens',
    updatedAt: false,
    createdAt: false,
    comment: 'JWT 리프레시 토큰 테이블',
  });
  return FmsJwtRefreshTokens;
};