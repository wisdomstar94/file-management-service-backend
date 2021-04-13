'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsUsers', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      userKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '회원 고유 식별키',
      },
      companyKey: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '회사 고유 식별키',
        // FK
      },
      permissionGroupKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '권한 그룹 고유 식별키',
        // FK
      },
      userLevel: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '회원 등급',
        // FK
      },
      userId: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
        comment: '회원 ID',
      },
      userPassword: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '회원 비밀번호',
      },
      userName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '회원명',
      },
      userPhone: {
        type: Sequelize.STRING(15),
        allowNull: true,
        comment: '회원 휴대폰번호',
      },
      userMemo: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '회원 메모',
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
      userStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '회원 상태 코드',
        // FK 설정
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '회원 테이블',
    });
    await queryInterface.addIndex('FmsUsers', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsUsers');
  }
};