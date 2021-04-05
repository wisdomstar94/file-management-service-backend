require('dotenv').config();

const config = {
  development: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_DEFAULT_DATABASE,
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+09:00',
  },
  test: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_DEFAULT_DATABASE,
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+09:00',
  },
  production: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_DEFAULT_DATABASE,
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+09:00',
  }
};

module.exports = config;
