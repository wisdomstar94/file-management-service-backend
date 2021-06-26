'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.FmsCodeGroups, { foreignKey: 'codeGroup', sourceKey: 'codeGroup' });
    }

    static async isExist(code) {
      const result = await this.findOne({
        where: {
          code: code,
        },
      });

      if (result === null) {
        return false;
      }

      return true;
    }

    static async isValidCode(codeGroup, code) {
      const result = await this.findOne({
        where: {
          codeGroup: codeGroup,
          code: code,
        },
      });

      if (result === null) {
        return false;
      }

      return true;
    }
  };
  FmsCodes.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      comment: '대체키 숫자값',
    },
    codeGroup: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: '코드 그룹',
      // FK
    },
    code: {
      type: DataTypes.STRING(13),
      allowNull: false,
      primaryKey: true,
      comment: '코드',
    },
    codeName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '코드명',
    },
    codeDescription: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '코드 설명',
    },
    codeValue1: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '코드 필요값 1',
    },
    codeValue2: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '코드 필요값 2',
    },
    sortNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '코드 표시 순서',
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
      comment: '코드 상태 (1: 사용, 2: 미사용)',
    },
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsCodes',
    tableName: 'FmsCodes',
    updatedAt: false,
    createdAt: false,
    comment: '코드 테이블',
  });
  return FmsCodes;
};