const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
require('dotenv').config();



// 내부에서 connection을 연결하여 사용후 바로 end 하는 방식 (트랜잭션이 필요 없는 경우)
exports.query = async(params) => {
  const connection = await mysql.createConnection({
    host: process.env.MAIN_MYSQL_DB_IP, 
    user: process.env.MAIN_MYSQL_DB_ID, 
    password: process.env.MAIN_MYSQL_DB_PW, 
    database: process.env.MAIN_MYSQL_DB_DEFAULT, 
    port: process.env.MAIN_MYSQL_DB_PORT, 
    multipleStatements: true,
    Promise: bluebird
  });
  
  const [ rows ] = await connection.execute(params.query, params.values);
  connection.end();
  return rows;
};



// 외부의 connection을 받아 사용후 connection에 대한 처리는 외부에 맡기는 방식 (트랜잭션이 필요한 경우)
exports.query2 = async(params) => {
  const [ rows ] = await params.connection.execute(params.query, params.values);
  return rows;
};

exports.transactionStart = async(params) => {
  await params.connection.query(`START TRANSACTION;`);
  return true;
};

exports.rollback = async(params) => {
  await params.connection.query(`ROLLBACK;`);
  params.connection.end();
  return true;
};

exports.commit = async(params) => {
  await params.connection.query(`COMMIT;`);
  params.connection.end();
  return true;
};




