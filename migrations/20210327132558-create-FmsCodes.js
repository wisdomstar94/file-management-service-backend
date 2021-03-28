'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsCodes', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        comment: '대체키 숫자값',
      },
      codeGroup: {
        type: Sequelize.STRING(5),
        allowNull: false,
        comment: '코드 그룹',
        // FK 설정
        // references: {
        //   // This is a reference to another model
        //   model: 'FmsCodeGroups',
        //   // This is the column name of the referenced model
        //   key: 'codeGroup',
        //   // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
        //   // deferrable: Deferrable.INITIALLY_IMMEDIATE
        //   // Options:
        //   // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
        //   // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
        //   // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
        // }
      },
      code: {
        type: Sequelize.STRING(13),
        allowNull: false,
        primaryKey: true,
        comment: '코드',
      },
      codeName: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: '코드명',
      },
      codeDescription: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '코드 설명',
      },
      codeValue1: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: '코드 필요값 1',
      },
      codeValue2: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: '코드 필요값 2',
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
      },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
        comment: '코드 상태 (1: 사용, 2: 미사용)',
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '코드 테이블',
    });
    await queryInterface.addIndex('FmsCodes', ['status']);
    await queryInterface.addIndex('FmsCodes', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsCodes');
  }
};