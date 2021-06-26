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
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    companyKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '회사 고유 식별키',
    },
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '회사명',
    },
    companyCEOName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '회사 대표자명',
    },
    companyCEOTel: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: '회사 대표자의 연락처',
    },
    companyTel: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: '회사대표번호',
    },
    companyBusinessNumber: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: '사업자번호',
    },
    companyAddress: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: '사업장주소',
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '회사 메모',
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
    // createrUserKey: DataTypes.STRING,
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '수정일',
    },
    updatedIp: {
      type: DataTypes.STRING(40),
      allowNull: true,
      comment: '수정시 요청 IP',
    },
    // updaterUserKey: DataTypes.STRING,
    companyStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '회사 상태',
    },
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsCompanys',
    updatedAt: false,
    createdAt: false,
    comment: '회사 테이블',
  });
  return FmsCompanys;
};