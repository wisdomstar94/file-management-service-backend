'use strict';
const {
  Model
} = require('sequelize');
// const db = require('./index');
module.exports = (sequelize, DataTypes) => {
  class FmsCodeGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async isExist(codeGroup) {
      const result = await this.findOne({
        where: {
          codeGroup: codeGroup,
        },
      });

      if (result === null) {
        return false;
      }

      return true;
    }
  };
  FmsCodeGroups.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    codeGroup: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
      comment: '코드 그룹',
    },
    codeGroupName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '코드 그룹명',
    },
    codeGroupDescription: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '코드 그룹 설명',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: '생성일',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '수정일',
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 1,
      comment: '코드 그룹 상태 (1: 사용, 2:미사용)',
    },
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    }
  }, {
    sequelize,
    modelName: 'FmsCodeGroups',
    tableName: 'FmsCodeGroups',
    updatedAt: false,
    createdAt: false,
    comment: '코드 그룹 테이블',
  });
  return FmsCodeGroups;
};