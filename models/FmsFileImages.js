'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFileImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFileImages.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    fileImageKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '파일 이미지 고유 식별키',
    },
    fileImageType: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '파일 이미지 종류 (대표이미지인지, 스크린샷인지 등)',
      // FK
    },
    fileKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '파일 고유 식별키',
      // FK
    },
    fileImageOriginalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '이미지 원본 파일명',
    },
    fileImageConvertName: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: '이미지 파일명 변환 후의 파일명',
    },
    fileYYYYMM: {
      type: DataTypes.STRING(6),
      allowNull: false,
      comment: '이미지 파일이 저장된 폴더의 월, 일',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '이미지 용량 (byte)',
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '저장된 파일 경로',
    },
    fileAccessUrl: {
      type: DataTypes.STRING(255),
      comment: '파일 이미지 접근 URL',
    },
    sortNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 1,
      comment: '이미지 순서',
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
    fileImageStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '파일 이미지 상태',
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
    modelName: 'FmsFileImages',
    tableName: 'FmsFileImages',
    updatedAt: false,
    createdAt: false,
    comment: '파일 이미지 테이블',
  });
  return FmsFileImages;
};