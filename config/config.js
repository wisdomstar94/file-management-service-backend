require('dotenv').config();

const config = {
  development: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_DEFAULT_DATABASE,
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE
  },
  test: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_DEFAULT_DATABASE,
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE
  },
  production: {
    username: process.env.MAIN_DB_USER,
    password: process.env.MAIN_DB_PASSWORD,
    database: process.env.MAIN_DB_DEFAULT_DATABASE,
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE
  }
};

module.exports = config;
