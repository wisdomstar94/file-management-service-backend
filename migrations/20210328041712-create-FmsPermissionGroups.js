'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsPermissionGroups', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      permissionGroupKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '권한 그룹 고유 식별키',
      },
      permissionGroupName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '권한 그룹명',
      },
      permissionGroupDescription: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '권한 그룹 설명',
      },
      sortNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '권한 그룹 순서',
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
      permissionGroupStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '권한 그룹 상태',
        // FK
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '권한 그룹 테이블',
    });
    await queryInterface.addIndex('FmsPermissionGroups', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsPermissionGroups');
  }
};