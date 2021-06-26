'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileDownloadLogsYYYYMM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileDownloadLogsYYYYMM.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    downloadLogKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '로그 고유 식별키',
    },
    downloadTargetUserKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '파일 다운로드시의 통계 대상 회원 고유키',
      // FK
    },
    fileDownloadUrlKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '파일 다운로드시의 이 다운로드 URL 에 설정된 파일 버전 식별키파일 다운로드시의 통계 대상 회원 고유키',
      // FK
    },
    fileVersionKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '파일 다운로드시의 이 다운로드 URL 에 설정된 파일 버전 식별키파일 다운로드시의 통계 대상 회원 고유키',
      // FK
    },
    userIdLogAt: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '로그 생성 당시의 회원 아이디',
    },
    fileLabelNameLogAt: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '로그 생성 당시의 파일 라벨명',
    },
    fileVersionCodeLogAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '로그 생성 당시의 파일 버전 코드',
    },
    fileVersionNameLogAt: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '로그 생성 당시의 파일 버전명',
    },
    fileOriginalNameLogAt: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '로그 생성 당시의 업로드 당시의 파일의 원래 이름(확장자 포함)',
    },
    fileDownloadNameLogAt: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '로그 생성 당시의 다운로드 될 때의 파일 이름',
    },
    fileSizeLogAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '로그 생성 당시의 다운로드 될 때의 파일 용량 (byte)',
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
    modelName: 'FmsFileDownloadLogsYYYYMM',
    tableName: 'FmsFileDownloadLogsYYYYMM',
    updatedAt: false,
    createdAt: false,
    comment: '파일 다운로드에 대한 로그가 저장되는 테이블 (월별로 분리되어 저장)',
  });
  return FmsFileDownloadLogsYYYYMM;
};