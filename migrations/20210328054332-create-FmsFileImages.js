'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsFileImages', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      fileImageKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '파일 이미지 고유 식별키',
      },
      fileKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '파일 고유 식별키',
        // FK
      },
      fileImageOriginalName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '이미지 원본 파일명',
      },
      filePath: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '저장된 파일 경로',
      },
      fileAccessUrl: {
        type: Sequelize.STRING(255),
        comment: '파일 이미지 접근 URL',
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
      fileImageStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '파일 이미지 상태',
        // FK
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '파일 이미지 테이블',
    });
    await queryInterface.addIndex('FmsFileImages', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsFileImages');
  }
};