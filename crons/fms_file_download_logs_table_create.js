const cron = require('node-cron');
const myDate = require('../routes/librarys/myDate');
const myLogger = require('../routes/librarys/myLogger');
const myMysql = require('../routes/librarys/myMysql');
const { Sequelize, QueryTypes } = require('sequelize');
require('dotenv').config();

// 1분마다 실행
cron.schedule('*/1 * * * *', async() => {
  const processId = process.env.NODE_APP_INSTANCE;

  if (Number(processId) !== 0) {
    return;
  }

  myLogger.info('FmsFileDownloadLogsYYYYMM 크론 시작 ' + myDate().format('YYYY-MM-DD HH:mm:ss') + ' => ' + processId);

  const now = myDate();
  const tomorrow = myDate().add(1, 'date');

  const now_YYYYMM = now.format('YYYYMM');
  const tomorrow_YYYYMM = tomorrow.format('YYYYMM');

  const sequelize = new Sequelize(process.env.MAIN_DB_DEFAULT_DATABASE, process.env.MAIN_DB_USER, process.env.MAIN_DB_PASSWORD, {
    host: process.env.MAIN_DB_IP,
    port: process.env.MAIN_DB_PORT,
    dialect: process.env.MAIN_DB_TYPE
  });
  await sequelize.authenticate();
  const queryInterface = sequelize.getQueryInterface();
  
  // now check
  const now_table_name = 'FmsFileDownloadLogs' + now_YYYYMM;
  const now_table_name_exist_result = await sequelize.query(`SHOW TABLES IN \`${process.env.MAIN_DB_DEFAULT_DATABASE}\` LIKE '${now_table_name}';`, {
    type: QueryTypes.SELECT,
  });

  myLogger.info(`now_table_name_exist_result.length = ${now_table_name_exist_result.length}`);
  if (now_table_name_exist_result.length === 0) {
    // table 생성
    myLogger.info(`${now_table_name} 테이블 생성..`);
    await queryInterface.createTable(now_table_name, {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      downloadLogKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '로그 고유 식별키',
      },
      downloadTargetUserKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '파일 다운로드시의 통계 대상 회원 고유키',
        // FK
      },
      fileDownloadUrlKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '파일 다운로드시의 다운로드 URL 고유 식별키',
        // FK
      },
      userIdLogAt: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '로그 생성 당시의 회원 아이디',
      },
      fileLabelNameLogAt: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '로그 생성 당시의 파일 라벨명',
      },
      fileVersionCodeLogAt: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '로그 생성 당시의 파일 버전 코드',
      },
      fileVersionNameLogAt: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '로그 생성 당시의 파일 버전명',
      },
      fileOriginalNameLogAt: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '로그 생성 당시의 업로드 당시의 파일의 원래 이름(확장자 포함)',
      },
      fileDownloadNameLogAt: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '로그 생성 당시의 다운로드 될 때의 파일 이름',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '생성일',
      },
      createdIp: {
        type: Sequelize.STRING(40),
        allowNull: false,
        comment: '생성시 요청 IP',
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '파일 다운로드에 대한 로그가 저장되는 테이블 (월별로 분리되어 저장)',
    });
    await queryInterface.addIndex(now_table_name, ['isDeletedRow']);
    await queryInterface.addConstraint(now_table_name, {
      fields: ['downloadTargetUserKey'],
      type: 'foreign key',
      name: `ffdlog${now_YYYYMM}_downloadTargetUserKey_fk`,
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint(now_table_name, {
      fields: ['fileDownloadUrlKey'],
      type: 'foreign key',
      name: `ffdlog${now_YYYYMM}_fileDownloadUrlKey_fk`,
      references: { // Required field
        table: 'FmsFileDownloadUrls',
        field: 'fileDownloadUrlKey',
      },
    });
  }


  // tomorrow check
  const tomorrow_table_name = 'FmsFileDownloadLogs' + tomorrow_YYYYMM;
  const tomorrow_table_name_exist_result = await sequelize.query(`SHOW TABLES IN \`${process.env.MAIN_DB_DEFAULT_DATABASE}\` LIKE '${tomorrow_table_name}';`, {
    type: QueryTypes.SELECT,
  });
  myLogger.info(`tomorrow_table_name_exist_result.length = ${tomorrow_table_name_exist_result.length}`);
  if (tomorrow_table_name_exist_result.length === 0) {
    // table 생성
    myLogger.info(`${tomorrow_table_name} 테이블 생성..`);
    await queryInterface.createTable(tomorrow_table_name, {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      downloadLogKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '로그 고유 식별키',
      },
      downloadTargetUserKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '파일 다운로드시의 통계 대상 회원 고유키',
        // FK
      },
      fileDownloadUrlKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '파일 다운로드시의 다운로드 URL 고유 식별키',
        // FK
      },
      userIdLogAt: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '로그 생성 당시의 회원 아이디',
      },
      fileLabelNameLogAt: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '로그 생성 당시의 파일 라벨명',
      },
      fileVersionCodeLogAt: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '로그 생성 당시의 파일 버전 코드',
      },
      fileVersionNameLogAt: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '로그 생성 당시의 파일 버전명',
      },
      fileOriginalNameLogAt: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '로그 생성 당시의 업로드 당시의 파일의 원래 이름(확장자 포함)',
      },
      fileDownloadNameLogAt: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '로그 생성 당시의 다운로드 될 때의 파일 이름',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '생성일',
      },
      createdIp: {
        type: Sequelize.STRING(40),
        allowNull: false,
        comment: '생성시 요청 IP',
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '파일 다운로드에 대한 로그가 저장되는 테이블 (월별로 분리되어 저장)',
    });
    await queryInterface.addIndex(tomorrow_table_name, ['isDeletedRow']);
    await queryInterface.addConstraint(tomorrow_table_name, {
      fields: ['downloadTargetUserKey'],
      type: 'foreign key',
      name: `ffdlog${tomorrow_YYYYMM}_downloadTargetUserKey_fk`,
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint(tomorrow_table_name, {
      fields: ['fileDownloadUrlKey'],
      type: 'foreign key',
      name: `ffdlog${tomorrow_YYYYMM}_fileDownloadUrlKey_fk`,
      references: { // Required field
        table: 'FmsFileDownloadUrls',
        field: 'fileDownloadUrlKey',
      },
    });
  }

  myLogger.info('FmsFileDownloadLogsYYYYMM 크론 종료 ' + myDate().format('YYYY-MM-DD HH:mm:ss') + ' => ' + processId);

  return;
});

