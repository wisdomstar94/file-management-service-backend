'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsPermissionGroupUploads', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      permissionGroupUploadKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '권한 등록 정보 고유 식별키',
      },
      permissionGroupKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '권한 그룹 고유 식별키',
        // FK
      },
      permissionKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '권한 고유 식별키',
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
      isActive: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'Y',
        comment: '활성(체크)여부 (Y:활성(체크), N:미활성(미체크))',
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: `그룹 권한별 활성화된 권한 정보 테이블 
(행이 존재하지 않으면 비활성(미체크)으로 인식하여 백엔드에서 처리)`,
    });
    await queryInterface.addIndex('FmsPermissionGroupUploads', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsPermissionGroupUploads');
  }
};