'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsJwtRefreshTokens', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      jwtRefreshTokenKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: 'JWT 리프레쉬 토큰 고유 식별키',
      },
      userKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '회원 고유 식별키',
        // FK
      },
      agent: {
        type: Sequelize.STRING(300),
        allowNull: false,
        comment: '리프레시 토큰 발급 당시 클라이언트로부터 온 헤더의 user-agent 값',
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
      endLineDateTime: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '토큰 유효 만료 날짜',
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: 'JWT 리프레시 토큰 테이블',
    });
    await queryInterface.addIndex('FmsJwtRefreshTokens', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsJwtRefreshTokens');
  }
};