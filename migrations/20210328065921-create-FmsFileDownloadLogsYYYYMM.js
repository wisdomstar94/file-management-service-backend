'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsFileDownloadLogsYYYYMM', {
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
      fileVersionKey: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '파일 다운로드시의 이 다운로드 URL 에 설정된 파일 버전 식별키파일 다운로드시의 통계 대상 회원 고유키',
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
      fileSizeLogAt: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '로그 생성 당시의 다운로드 될 때의 파일 용량 (byte)',
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
    await queryInterface.addIndex('FmsFileDownloadLogsYYYYMM', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsFileDownloadLogsYYYYMM');
  }
};