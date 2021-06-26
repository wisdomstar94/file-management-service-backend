'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async findUserKey(userKey) {
      const result = await this.findOne({
        where: { 
          userKey: userKey,
        },  
      });
      return result;
    }

    static async getUserLevel(userKey) {
      const result = await this.findOne({
        attributes: ['userLevel'],
        where: {
          userKey: userKey,
        },
      });
      return result.userLevel;
    }

    static async getChildAllUserKeys(userKey) {
      let childUserKeys = [];

      childUserKeys.push(userKey);
      const parentUserKeys = [
        [userKey],
      ];

      for (let i = 0; i < 10000; i++) {
        const result = await this.findAll({
          attributes: ['userKey'],
          where: {
            parentUserKey: parentUserKeys[i],
          },
        });

        if (result.length === 0) {
          break;
        }

        childUserKeys = childUserKeys.concat(result.map((x) => {
          return x.userKey;
        }));
        parentUserKeys.push(result.map((x) => {
          return x.userKey;
        }));
      }

      return childUserKeys;
    }
  };
  FmsUsers.init({
    seq: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      comment: '대체키 숫자값',
    },
    parentUserKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '부모 회원 고유 식별키',
    },
    userKey: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false,
      comment: '회원 고유 식별키',
    },
    companyKey: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '회사 고유 식별키',
      // FK
    },
    permissionGroupKey: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '권한 그룹 고유 식별키',
      // FK
    },
    userLevel: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '회원 등급',
      // FK
    },
    userId: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      comment: '회원 ID',
    },
    userPassword: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '회원 비밀번호',
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '회원명',
    },
    userPhone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: '회원 휴대폰번호',
    },
    userMemo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '회원 메모',
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
    userStatus: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: '회원 상태 코드',
      // FK 설정
    },
    isDeletedRow: {
      type: DataTypes.ENUM(['Y', 'N']),
      allowNull: false,
      defaultValue: 'N',
      comment: '행 삭제 여부',
    },
  }, {
    sequelize,
    modelName: 'FmsUsers',
    tableName: 'FmsUsers',
    updatedAt: false,
    createdAt: false,
    comment: '회원 테이블',
  });
  return FmsUsers;
};