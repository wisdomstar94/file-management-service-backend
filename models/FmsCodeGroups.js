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
    seq: DataTypes.BIGINT,
    codeGroup: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    codeGroupName: DataTypes.STRING,
    codeGroupDescription: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    status: DataTypes.TINYINT,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsCodeGroups',
    updatedAt: false,
    createdAt: false,
  });
  return FmsCodeGroups;
};