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
    seq: DataTypes.BIGINT,
    parentUserKey: DataTypes.STRING,
    userKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    companyKey: DataTypes.STRING,
    permissionGroupKey: DataTypes.STRING,
    userLevel: DataTypes.STRING,
    userId: DataTypes.STRING,
    userPassword: DataTypes.TEXT,
    userName: DataTypes.STRING,
    userPhone: DataTypes.STRING,
    userMemo: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedIp: DataTypes.STRING,
    userStatus: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsUsers',
    updatedAt: false,
    createdAt: false,
  });
  return FmsUsers;
};