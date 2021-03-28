'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsFileDownloadUrlAccessConditions', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      fileAccessConditionKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '파일 다운로드 URL 접근 조건 고유 식별키',
      },
      fileDownloadUrlKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '파일 다운로드 URL 고유 식별키',
        // FK
      },
      conditionType: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '접근 조건 종류 코드',
        // FK
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: '조건에 해당하는 키',
      },
      value: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: '조건에 해당하는 값',
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
      conditionStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '조건 상태',
        // FK
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '파일 다운로드 URL 접근 조건 테이블',
    });
    await queryInterface.addIndex('FmsFileDownloadUrlAccessConditions', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsFileDownloadUrlAccessConditions');
  }
};