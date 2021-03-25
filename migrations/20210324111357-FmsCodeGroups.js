'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsCodeGroups', {
      seq: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        comment: '대체키 숫자값',
      },
      codeGroup: {
        type: Sequelize.STRING(5),
        allowNull: false,
        primaryKey: true,
        comment: '코드 그룹',
      },
      codeGroupName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '코드 그룹명'
      },
      codeGroupDescription: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: '코드 그룹 설명'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '생성일',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull: true,
        comment: '수정일',
      },
      status: {
        type: Sequelize.TINYINT(1),
        comment: '코드 그룹 상태 (1: 사용, 2:미사용)',
        defaultValue: 1,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsCodeGroups');
  }
};