'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsCompanyInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsCompanyInfos.init({
    seq: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    companyInfoKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '회사 정보 식별키',
    },
    companyKey: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      comment: '회사 고유 식별키',
    },
    createrUserKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '회원 고유 식별키',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '생성일',
    },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '수정일',
    }
  }, {
    sequelize,
    modelName: 'FmsCompanyInfos',
    updatedAt: false,
    createdAt: false,
  });
  return FmsCompanyInfos;
};