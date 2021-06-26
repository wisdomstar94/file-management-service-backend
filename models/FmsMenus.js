'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsMenus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsMenus.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    parentMenuKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '부모 메뉴 고유 식별키',
      // FK
    },
    menuCategoryKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '메뉴 카테고리 고유 식별키',
      // FK
    },
    menuKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '메뉴 고유 식별키',
    },
    menuName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '메뉴명',
    },
    menuDescription: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '메뉴 설명',
    },
    menuIconPath: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '메뉴 아이콘 path',
    },
    menuLink: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '메뉴 이동 경로',
    },
    sortNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '메뉴 순서',
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
    menuStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '메뉴 상태',
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
    modelName: 'FmsMenus',
    tableName: 'FmsMenus',
    updatedAt: false,
    createdAt: false,
    comment: '관리자 메뉴 테이블',
  });
  return FmsMenus;
};