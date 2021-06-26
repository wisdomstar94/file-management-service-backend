'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsLogsYYYYMM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsLogsYYYYMM.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    logKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '로그 고유 식별키',
    },
    accessUniqueKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '요청 식별 키',
    },
    logType: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '로그 종류',
      // FK
    },
    userKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '로그 주체자의 회원 고유 식별키',
      // FK
    },
    logContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '로그 내용',
    },
    value1: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '로그 생성시 필요한 값 1',
    },
    value2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '로그 생성시 필요한 값 2',
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
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsLogsYYYYMM',
    tableName: 'FmsLogsYYYYMM',
    updatedAt: false,
    createdAt: false,
    comment: '파일 관리 서비스에 대한 전박적인 로그가 저장되는 테이블 (월별로 분리되어 저장)',
  });
  return FmsLogsYYYYMM;
};