'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsPermissionGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsPermissionGroups.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    permissionGroupKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '권한 그룹 고유 식별키',
    },
    permissionGroupName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '권한 그룹명',
    },
    permissionGroupDescription: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '권한 그룹 설명',
    },
    sortNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '권한 그룹 순서',
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
    permissionGroupStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '권한 그룹 상태',
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
    modelName: 'FmsPermissionGroups',
    tableName: 'FmsPermissionGroups',
    updatedAt: false,
    createdAt: false,
    comment: '권한 그룹 테이블',
  });
  return FmsPermissionGroups;
};