'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('FmsFileDownloadUrls', 'isPossibleDatetimeShow', { 
      type: Sequelize.ENUM(['Y', 'N']), 
      allowNull: false,
      defaultValue: 'N',
      comment: '파일 다운로드 가능일 외부에 표시 여부',
    });

    await queryInterface.addIndex('FmsFileDownloadUrls', ['isPossibleDatetimeShow']);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
