'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsCompanyInfos', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      companyInfoKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '회사 정보 식별키',
      },
      companyKey: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false,
        comment: '회사 고유 식별키',
        // FK
      },
      createrUserKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '회원 고유 식별키',
        // FK
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '생성일',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '수정일',
      }
    }, {
      comment: '회사 부가 정보 테이블',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsCompanyInfos');
  }
};