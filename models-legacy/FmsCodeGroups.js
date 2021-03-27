'use strict';
const FmsCodes = require('./FmsCodes');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsCodeGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(FmsCodes, { as: 'codeGroup' });
    }

    static async getCodeGroupAllList() {
      const list = await FmsCodeGroups.findAll();
      return list.map((x) => { return x.dataValues });
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
  }, {
    sequelize,
    modelName: 'FmsCodeGroups',
  });
  return FmsCodeGroups;
};