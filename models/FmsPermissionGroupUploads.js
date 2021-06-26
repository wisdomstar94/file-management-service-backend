'use strict';
const {
  Model
} = require('sequelize');
// const db = require('./index');
const FmsUsers = require('./FmsUsers');
module.exports = (sequelize, DataTypes) => {
  class FmsPermissionGroupUploads extends Model {
    

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async isActivePermission(userKey, permissionKey) {
      const userInfo = await FmsUsers.findOne({
        where: {
          userKey: userKey,
        },
      });

      if (userInfo === null) {
        return false;
      }

      const permissionGroupUploadInfo = await this.findOne({
        where: {
          permissionGroupKey: userInfo.permissionGroupKey,
          permissionKey: permissionKey,
          isActive: 'Y',
          isDeletedRow: 'N',
        },
      });

      if (permissionGroupUploadInfo === null) {
        return false;
      }

      return true;
    }
  };
  FmsPermissionGroupUploads.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    permissionGroupUploadKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '권한 등록 정보 고유 식별키',
    },
    permissionGroupKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '권한 그룹 고유 식별키',
      // FK
    },
    permissionKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '권한 고유 식별키',
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
    isActive: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'Y',
      comment: '활성(체크)여부 (Y:활성(체크), N:미활성(미체크))',
    },
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsPermissionGroupUploads',
    tableName: 'FmsPermissionGroupUploads',
    updatedAt: false,
    createdAt: false,
    comment: `그룹 권한별 활성화된 권한 정보 테이블 
(행이 존재하지 않으면 비활성(미체크)으로 인식하여 백엔드에서 처리)`,
  });
  return FmsPermissionGroupUploads;
};