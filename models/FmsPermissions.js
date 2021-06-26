'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async getCurrentMaxSortNo(menuKey) {
      const result = await this.findOne({
        where: {
          menuKey: menuKey,
        },
        limit: 1,
        order: [
          ['sortNo', 'DESC'],
        ],
      });

      if (result === null) {
        return 0;
      }

      return result.sortNo;
    }
  };
  FmsPermissions.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    menuKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '메뉴 고유 식별키',
      // FK
    },
    permissionKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '권한 고유 식별키',
    },
    permissionName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '권한명',
    },
    permissionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '권한 설명',
    },
    sortNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '권한 순서',
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
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsPermissions',
    tableName: 'FmsPermissions',
    updatedAt: false,
    createdAt: false,
    comment: `각 메뉴별로 권한 내용이 지정된 테이블 
(권한 그룹 생성 페이지에서 여기에 해당하는 내용이 모두 표시되며, 
여기중에 원하는 권한만 체크를 하면 FmsPermissionGroupUploads에 행이 생성된다)`,
  });
  return FmsPermissions;
};