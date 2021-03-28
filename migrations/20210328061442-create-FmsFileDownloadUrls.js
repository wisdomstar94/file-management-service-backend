'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsFileDownloadUrls', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      fileDownloadUrlKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '파일 다운로드 고유 식별키',
      },
      downloadTargetUserKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '다운로드시 카운팅 및 통계 대상이 되는 회원 고유 식별키',
        // FK
      },
      fileKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '다운로드 대상의 파일 고유 식별키',
        // FK
      },
      fileVersionKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '다운로드 대상의 파일 버전 고유 식별키',
        // FK
      },
      fileDownloadUrlAccessCount: {
        type: Sequelize.BIGINT,
        allowNull: false,
        comment: '파일 다운로드 URL 접근 시도 횟수',
      },
      fileDownloadPossibleDateTimeStart: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '파일 다운로드 제한 시작일',
      },
      fileDownloadPossibleDateTimeEnd: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '파일 다운로드 제한 종료일',
      },
      fileDownloadLimitMaxCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '다운로드 가능한 최대 수',
      },
      fileDownloadCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '파일 다운로드 된 수 (초기화 가능)',
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
      createrUserKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '생성자 회원 고유 식별키',
        // FK
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '수정일',
      },
      updatedIp: {
        type: Sequelize.STRING(40),
        allowNull: true,
        comment: '수정시 요청 IP',
      },
      updaterUserKey: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '수정자 회원 고유 식별키',
        // FK
      },
      fileDownloadUrlStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '파일 다운로드 URL 상태',
        // FK
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    });
    await queryInterface.addIndex('FmsFileDownloadUrls', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsFileDownloadUrls');
  }
};