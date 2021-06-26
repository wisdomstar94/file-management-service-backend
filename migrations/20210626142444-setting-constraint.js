'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // FmsPermissionGroupInfos
    await queryInterface.addConstraint('FmsPermissionGroupInfos', {
      fields: ['permissionGroupKey'],
      type: 'foreign key',
      name: 'fpgis_permissionGroupKey_fk',
      references: { // Required field
        table: 'FmsPermissionGroups',
        field: 'permissionGroupKey',
      },
    });
    await queryInterface.addConstraint('FmsPermissionGroupInfos', {
      fields: ['createrUserKey'],
      type: 'foreign key',
      name: 'fpgis_createrUserKey_fk',
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
