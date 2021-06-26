'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsFiles.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    fileKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '파일 고유 식별키',
    },
    fileLabelName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '파일 라벨명(파일을 인식하기 위한 명칭)',
    },
    fileMemo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '파일 메모 (내부 구분용)',
    },
    fileDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '파일 설명글 (외부에 노출될 설명글)',
    },
    fileStoreVersionHistoryOpen: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '외부에 파일 버전의 변경 이력 노출 여부',
    },
    fileStoreDescriptionOpen: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '외부에 파일 설명글 노출 여부',
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
    fileStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '파일 상태',
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
    modelName: 'FmsFiles',
    tableName: 'FmsFiles',
    updatedAt: false,
    createdAt: false,
    comment: '파일 테이블',
  });
  return FmsFiles;
};