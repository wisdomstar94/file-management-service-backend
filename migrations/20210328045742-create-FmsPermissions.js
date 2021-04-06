'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsPermissions', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      menuKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '메뉴 고유 식별키',
        // FK
      },
      permissionKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '권한 고유 식별키',
      },
      permissionName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '권한명',
      },
      permissionDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '권한 설명',
      },
      sortNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '권한 순서',
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
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: `각 메뉴별로 권한 내용이 지정된 테이블 
(권한 그룹 생성 페이지에서 여기에 해당하는 내용이 모두 표시되며, 
여기중에 원하는 권한만 체크를 하면 FmsPermissionGroupUploads에 
행이 생성된다)`,
    });
    await queryInterface.addIndex('FmsPermissions', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsPermissions');
  }
};