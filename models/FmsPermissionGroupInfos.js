'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsPermissionGroupInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsPermissionGroupInfos.init({
    seq: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    permissionGroupInfoKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '권한 그룹 정보 식별키',
    },
    permissionGroupKey: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      comment: '권한 그룹 고유 식별키',
    },
    createrUserKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '회원 고유 식별키',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '생성일',
    },
    updateAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '수정일',
    }
  }, {
    sequelize,
    modelName: 'FmsPermissionGroupInfos',
    updatedAt: false,
    createdAt: false,
  });
  return FmsPermissionGroupInfos;
};