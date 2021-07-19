'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('FmsFileDownloadUrls', 'isDownloadCountInfoShow', { 
      type: Sequelize.ENUM(['Y', 'N']), 
      allowNull: false,
      defaultValue: 'N',
      comment: '다운로드 제한 횟수 및 다운로드된 수 외부에 표시 여부',
    });

    await queryInterface.addIndex('FmsFileDownloadUrls', ['isDownloadCountInfoShow']);
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
