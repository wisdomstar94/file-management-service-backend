'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsFiles', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      fileKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '파일 고유 식별키',
      },
      fileLabelName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '파일 라벨명(파일을 인식하기 위한 명칭)',
      },
      fileMemo: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '파일 메모 (내부 구분용)',
      },
      fileDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '파일 설명글 (외부에 노출될 설명글)',
      },
      fileStoreVersionHistoryOpen: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '외부에 파일 버전의 변경 이력 노출 여부',
      },
      fileStoreDescriptionOpen: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '외부에 파일 설명글 노출 여부',
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
      fileStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '파일 상태',
        // FK
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '파일 테이블',
    });
    await queryInterface.addIndex('FmsFiles', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsFiles');
  }
};