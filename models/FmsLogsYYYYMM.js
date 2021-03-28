'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FmsLogsYYYYMM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FmsLogsYYYYMM.init({
    seq: DataTypes.BIGINT,
    logKey: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    logType: DataTypes.STRING,
    userKey: DataTypes.STRING,
    logContent: DataTypes.TEXT,
    value1: DataTypes.STRING,
    value2: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    createdIp: DataTypes.STRING,
    isDeletedRow: DataTypes.ENUM(['Y', 'N']),
  }, {
    sequelize,
    modelName: 'FmsLogsYYYYMM',
    tableName: 'FmsLogsYYYYMM',
  });
  return FmsLogsYYYYMM;
};