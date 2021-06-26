'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsMenuCategorys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsMenuCategorys.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    menuCategoryKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '메뉴 카테고리 고유 식별키',
    },
    menuCategoryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '메뉴 카테고리명',
    },
    menuCategoryDescription: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '메뉴 카테고리 설명',
    },
    sortNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '순서',
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
    menuCategoryStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '메뉴 카테고리 상태',
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
    modelName: 'FmsMenuCategorys',
    tableName: 'FmsMenuCategorys',
    updatedAt: false,
    createdAt: false,
    comment: '관리자 메뉴 카테고리 테이블',
  });
  return FmsMenuCategorys;
};