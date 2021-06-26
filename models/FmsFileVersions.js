'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileVersions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileVersions.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    fileVersionKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '파일 버전 고유 식별키',
    },
    fileKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '파일 고유 식별키',
      // FK
    },
    fileVersionName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: '파일 버전명',
    },
    fileVersionCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '파일 버전 코드',
    },
    fileOriginalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '업로드 당시의 파일의 원래 이름(확장자 포함)',
    },
    fileDownloadName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '다운로드 될 때의 파일 이름 지정',
    },
    fileVersionMemo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '파일 버전에 대한 메모',
    },
    fileVersionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '파일 버전에 대한 설명글 (외부에 공개될 내용)',
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: '저장된 파일 경로',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '저장된 파일 용량 (byte)',
    },
    fileMimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '저장된 파일 종류',
    },
    createrUserKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '생성자 회원 고유 식별키',
      // FK
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
    updaterUserKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '수정자 회원 고유 식별키',
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
    fileVersionStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '파일 버전 상태',
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
    modelName: 'FmsFileVersions',
    tableName: 'FmsFileVersions',
    updatedAt: false,
    createdAt: false,
    comment: '파일 버전 테이블',
  });
  return FmsFileVersions;
};