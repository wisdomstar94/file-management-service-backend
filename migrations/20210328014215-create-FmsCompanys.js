'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsCompanys', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      companyKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '회사 고유 식별키',
      },
      companyName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '회사명',
      },
      companyCEOName: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: '회사 대표자명',
      },
      companyCEOTel: {
        type: Sequelize.STRING(15),
        allowNull: true,
        comment: '회사 대표자의 연락처',
      },
      companyTel: {
        type: Sequelize.STRING(15),
        allowNull: true,
        comment: '회사대표번호',
      },
      companyBusinessNumber: {
        type: Sequelize.STRING(15),
        allowNull: true,
        comment: '사업자번호',
      },
      companyAddress: {
        type: Sequelize.STRING(150),
        allowNull: true,
        comment: '사업장주소',
      },
      memo: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '회사 메모',
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
      // createrUserKey: {
      //   type: Sequelize.STRING(20),
      //   allowNull: false,
      //   comment: '생성자 회원 고유 식별키',
      //   // FK 설정
      // },
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
      // updaterUserKey: {
      //   type: Sequelize.STRING(20),
      //   allowNull: true,
      //   comment: '수정자 회원 고유 식별키',
      //   // FK 설정
      // },
      companyStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '회사 상태',
        // FK 설정
      },
      // companyInfoKey: {
      //   type: Sequelize.STRING(20),
      //   unique: true,
      //   allowNull: false,
      //   comment: '회사 정보 식별키',
      //   // FK
      // },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '회사 테이블',
    });
    await queryInterface.addIndex('FmsCompanys', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsCompanys');
  }
};