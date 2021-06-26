'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // FmsCompanyInfos
    await queryInterface.addConstraint('FmsCompanyInfos', {
      fields: ['companyKey'],
      type: 'foreign key',
      name: 'fcis_companyKey_fk',
      references: { // Required field
        table: 'FmsCompanys',
        field: 'companyKey',
      },
    });
    await queryInterface.addConstraint('FmsCompanyInfos', {
      fields: ['createrUserKey'],
      type: 'foreign key',
      name: 'fcis_createrUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
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
