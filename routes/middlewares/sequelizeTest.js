const { Sequelize } = require('sequelize');
const myLogger = require('../librarys/myLogger');
const db = require('../../models');
require('dotenv').config();

const sequelizeTest = async(req, res, next) => {
  const sequelize = new Sequelize(process.env.MAIN_DB_DEFAULT_DATABASE, process.env.MAIN_DB_USER, process.env.MAIN_DB_PASSWORD, {
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE
  });
  try {
    await sequelize.authenticate();
    const list = await db.FmsCodeGroups.findAll();
    console.log('list', list);
    // for (let i = 0; i < list.length; i++) {
    //   console.log('list[' + i + ']', list[i]);
    //   console.log('list[' + i + '].dataValues', list[i].dataValues);
    // }
    const list_custom = await db.FmsCodeGroups.getCodeGroupAllList();
    console.log('list_custom', list_custom);
    myLogger.info(req.logHeadTail + 'Connection has been established successfully.');
  } catch (error) {
    myLogger.error(req.logHeadTail + 'Unable to connect to the database:');
    myLogger.error(req.logHeadTail + error.stack);
    myLogger.error(req.logHeadTail + JSON.stringify(error));
  }
  next();
};

module.exports = sequelizeTest;
