const winston = require('winston');
const myDate = require('./myDate');
const appRoot = require('app-root-path');
require('winston-daily-rotate-file');
require('date-utils');

const logger = winston.createLogger({
  level: 'debug', // 최소 레벨
  // 파일저장
  transports: [
    new winston.transports.DailyRotateFile({
      filename : appRoot + '/logs/system.log', // log 폴더에 system.log 이름으로 저장
      zippedArchive: true, // 압축여부
      json: true,
      format: winston.format.printf(
        info => `${myDate().format('YYYY-MM-DD HH:mm:ss')} [${info.level.toUpperCase()}] - ${info.message}`
      )
    }),
    // 콘솔 출력
    new winston.transports.Console({
      json: true,
      format: winston.format.printf(
        info => `${myDate().format('YYYY-MM-DD HH:mm:ss')} [${info.level.toUpperCase()}] - ${info.message}`
      )
    })
  ]
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message.replace('\n', ''));
  }
};

module.exports = logger;
