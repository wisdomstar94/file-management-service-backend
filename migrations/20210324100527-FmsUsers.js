'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsUsers', {
      seq: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        comment: '대체키 숫자값',
      },
      userKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '회원 고유 식별키',
      },
      userId: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
        comment: '회원 ID',
      },
      userName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '회원명',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '생성일',
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        comment: '수정일',
      },
      userStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        defaultValue: 'USRST00000001',
        comment: '회원상태',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsUsers');
  },
};