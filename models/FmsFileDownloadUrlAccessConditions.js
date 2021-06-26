'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileDownloadUrlAccessConditions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileDownloadUrlAccessConditions.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    fileAccessConditionKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '파일 다운로드 URL 접근 조건 고유 식별키',
    },
    fileDownloadUrlKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '파일 다운로드 URL 고유 식별키',
      // FK
    },
    conditionType: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '접근 조건 종류 코드',
      // FK
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '조건에 해당하는 키',
    },
    value: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: '조건에 해당하는 값',
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
    createrUserKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '생성자 회원 고유 식별키',
      // FK
    },
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
    updaterUserKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '수정자 회원 고유 식별키',
      // FK
    },
    conditionStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '조건 상태',
      // FK
    },
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsFileDownloadUrlAccessConditions',
    tableName: 'FmsFileDownloadUrlAccessConditions',
    updatedAt: false,
    createdAt: false,
    comment: '파일 다운로드 URL 접근 조건 테이블',
  });
  return FmsFileDownloadUrlAccessConditions;
};