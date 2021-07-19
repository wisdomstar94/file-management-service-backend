'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileDownloadUrls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileDownloadUrls.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    fileDownloadUrlKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '파일 다운로드 고유 식별키',
    },
    downloadTargetUserKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '다운로드시 카운팅 및 통계 대상이 되는 회원 고유 식별키',
      // FK
    },
    fileKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '다운로드 대상의 파일 고유 식별키',
      // FK
    },
    fileVersionKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '다운로드 대상의 파일 버전 고유 식별키 (NULL 이면 최신 버전을 찾아 처리)',
      // FK
    },
    fileDownloadUrlAccessCount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '파일 다운로드 URL 접근 시도 횟수',
    },
    fileDownloadPossibleDateTimeStart: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '파일 다운로드 제한 시작일',
    },
    fileDownloadPossibleDateTimeEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: '파일 다운로드 제한 종료일',
    },
    fileDownloadLimitMaxCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '다운로드 가능한 최대 수',
    },
    fileDownloadCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '파일 다운로드 된 수 (초기화 가능)',
    },
    isPossibleDatetimeShow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '파일 다운로드 가능일 외부에 표시 여부',
    },
    isDownloadCountInfoShow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '다운로드 제한 횟수 및 다운로드된 수 외부에 표시 여부',
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
    fileDownloadUrlStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '파일 다운로드 URL 상태',
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
    modelName: 'FmsFileDownloadUrls',
    tableName: 'FmsFileDownloadUrls',
    updatedAt: false,
    createdAt: false,
    comment: '파일 다운로드 URL 테이블',
  });
  return FmsFileDownloadUrls;
};