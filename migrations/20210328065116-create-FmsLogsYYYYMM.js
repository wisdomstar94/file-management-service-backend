'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsLogsYYYYMM', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      logKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '로그 고유 식별키',
      },
      logType: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '로그 종류',
        // FK
      },
      userKey: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '로그 주체자의 회원 고유 식별키',
        // FK
      },
      logContent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '로그 내용',
      },
      value1: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '로그 생성시 필요한 값 1',
      },
      value2: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '로그 생성시 필요한 값 2',
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
      comment: '파일 관리 서비스에 대한 전박적인 로그가 저장되는 테이블 (월별로 분리되어 저장)',
    });
    await queryInterface.addIndex('FmsLogsYYYYMM', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsLogsYYYYMM');
  }
};