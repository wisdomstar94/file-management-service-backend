'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // FmsCodes
    await queryInterface.addConstraint('FmsCodes', {
      fields: ['codeGroup'],
      type: 'foreign key',
      name: 'fc_codeGroup_fk',
      references: { // Required field
        table: 'FmsCodeGroups',
        field: 'codeGroup',
      },
    });

    // FmsUsers
    await queryInterface.addConstraint('FmsUsers', {
      fields: ['companyKey'],
      type: 'foreign key',
      name: 'fu_companyKey_fk',
      references: { // Required field
        table: 'FmsCompanys',
        field: 'companyKey',
      },
    });
    await queryInterface.addConstraint('FmsUsers', {
      fields: ['permissionGroupKey'],
      type: 'foreign key',
      name: 'fu_permissionGroupKey_fk',
      references: { // Required field
        table: 'FmsPermissionGroups',
        field: 'permissionGroupKey',
      },
    });
    await queryInterface.addConstraint('FmsUsers', {
      fields: ['userLevel'],
      type: 'foreign key',
      name: 'fu_userLevel_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });
    await queryInterface.addConstraint('FmsUsers', {
      fields: ['userStatus'],
      type: 'foreign key',
      name: 'fu_userStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsCompanys
    // await queryInterface.addConstraint('FmsCompanys', {
    //   fields: ['createrUserKey'],
    //   type: 'foreign key',
    //   name: 'fcp_createrUserKey_fk',
    //   references: { // Required field
    //     table: 'FmsUsers',
    //     field: 'userKey',
    //   },
    // });
    // await queryInterface.addConstraint('FmsCompanys', {
    //   fields: ['updaterUserKey'],
    //   type: 'foreign key',
    //   name: 'fcp_updaterUserKey_fk',
    //   references: { // Required field
    //     table: 'FmsUsers',
    //     field: 'userKey',
    //   },
    // });
    await queryInterface.addConstraint('FmsCompanys', {
      fields: ['companyStatus'],
      type: 'foreign key',
      name: 'fcp_companyStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsPermissionGroups
    await queryInterface.addConstraint('FmsPermissionGroups', {
      fields: ['permissionGroupStatus'],
      type: 'foreign key',
      name: 'fpg_permissionGroupStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsMenus
    await queryInterface.addConstraint('FmsMenus', {
      fields: ['parentMenuKey'],
      type: 'foreign key',
      name: 'fm_parentMenuKey_fk',
      references: { // Required field
        table: 'FmsMenus',
        field: 'menuKey',
      },
    });
    await queryInterface.addConstraint('FmsMenus', {
      fields: ['menuCategoryKey'],
      type: 'foreign key',
      name: 'fm_menuCategoryKey_fk',
      references: { // Required field
        table: 'FmsMenuCategorys',
        field: 'menuCategoryKey',
      },
    });
    await queryInterface.addConstraint('FmsMenus', {
      fields: ['menuStatus'],
      type: 'foreign key',
      name: 'fm_menuStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsMenuCategorys
    await queryInterface.addConstraint('FmsMenuCategorys', {
      fields: ['menuCategoryStatus'],
      type: 'foreign key',
      name: 'fmct_menuCategoryStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsPermissions
    await queryInterface.addConstraint('FmsPermissions', {
      fields: ['menuKey'],
      type: 'foreign key',
      name: 'fp_menuKey_fk',
      references: { // Required field
        table: 'FmsMenus',
        field: 'menuKey',
      },
    });

    // FmsPermissionGroupUploads
    await queryInterface.addConstraint('FmsPermissionGroupUploads', {
      fields: ['permissionGroupKey'],
      type: 'foreign key',
      name: 'fpgu_permissionGroupKey_fk',
      references: { // Required field
        table: 'FmsPermissionGroups',
        field: 'permissionGroupKey',
      },
    });
    await queryInterface.addConstraint('FmsPermissionGroupUploads', {
      fields: ['permissionKey'],
      type: 'foreign key',
      name: 'fpgu_permissionKey_fk',
      references: { // Required field
        table: 'FmsPermissions',
        field: 'permissionKey',
      },
    });

    // FmsFiles
    await queryInterface.addConstraint('FmsFiles', {
      fields: ['createrUserKey'],
      type: 'foreign key',
      name: 'ffe_createrUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFiles', {
      fields: ['updaterUserKey'],
      type: 'foreign key',
      name: 'ffe_updaterUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFiles', {
      fields: ['fileStatus'],
      type: 'foreign key',
      name: 'ffe_fileStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });
    
    // FmsFileImages
    await queryInterface.addConstraint('FmsFileImages', {
      fields: ['fileKey'],
      type: 'foreign key',
      name: 'ffimg_fileKey_fk',
      references: { // Required field
        table: 'FmsFiles',
        field: 'fileKey',
      },
    });
    await queryInterface.addConstraint('FmsFileImages', {
      fields: ['fileImageType'],
      type: 'foreign key',
      name: 'ffimg_fileImageType_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });
    await queryInterface.addConstraint('FmsFileImages', {
      fields: ['fileImageStatus'],
      type: 'foreign key',
      name: 'ffimg_fileImageStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsFileVersions
    await queryInterface.addConstraint('FmsFileVersions', {
      fields: ['fileKey'],
      type: 'foreign key',
      name: 'ffver_fileKey_fk',
      references: { // Required field
        table: 'FmsFiles',
        field: 'fileKey',
      },
    });
    await queryInterface.addConstraint('FmsFileVersions', {
      fields: ['createrUserKey'],
      type: 'foreign key',
      name: 'ffver_createrUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileVersions', {
      fields: ['updaterUserKey'],
      type: 'foreign key',
      name: 'ffver_updaterUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileVersions', {
      fields: ['fileVersionStatus'],
      type: 'foreign key',
      name: 'ffver_fileVersionStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsFileDownloadUrls
    await queryInterface.addConstraint('FmsFileDownloadUrls', {
      fields: ['downloadTargetUserKey'],
      type: 'foreign key',
      name: 'ffdu_downloadTargetUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrls', {
      fields: ['fileKey'],
      type: 'foreign key',
      name: 'ffdu_fileKey_fk',
      references: { // Required field
        table: 'FmsFiles',
        field: 'fileKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrls', {
      fields: ['fileVersionKey'],
      type: 'foreign key',
      name: 'ffdu_fileVersionKey_fk',
      references: { // Required field
        table: 'FmsFileVersions',
        field: 'fileVersionKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrls', {
      fields: ['createrUserKey'],
      type: 'foreign key',
      name: 'ffdu_createrUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrls', {
      fields: ['updaterUserKey'],
      type: 'foreign key',
      name: 'ffdu_updaterUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrls', {
      fields: ['fileDownloadUrlStatus'],
      type: 'foreign key',
      name: 'ffdu_fileDownloadUrlStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsFileDownloadUrlAccessConditions
    await queryInterface.addConstraint('FmsFileDownloadUrlAccessConditions', {
      fields: ['fileDownloadUrlKey'],
      type: 'foreign key',
      name: 'ffduac_fileDownloadUrlKey_fk',
      references: { // Required field
        table: 'FmsFileDownloadUrls',
        field: 'fileDownloadUrlKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrlAccessConditions', {
      fields: ['conditionType'],
      type: 'foreign key',
      name: 'ffduac_conditionType_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrlAccessConditions', {
      fields: ['createrUserKey'],
      type: 'foreign key',
      name: 'ffduac_createrUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrlAccessConditions', {
      fields: ['updaterUserKey'],
      type: 'foreign key',
      name: 'ffduac_updaterUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadUrlAccessConditions', {
      fields: ['conditionStatus'],
      type: 'foreign key',
      name: 'ffduac_conditionStatus_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });

    // FmsLogsYYYYMM
    await queryInterface.addConstraint('FmsLogsYYYYMM', {
      fields: ['logType'],
      type: 'foreign key',
      name: 'flog_logType_fk',
      references: { // Required field
        table: 'FmsCodes',
        field: 'code',
      },
    });
    await queryInterface.addConstraint('FmsLogsYYYYMM', {
      fields: ['userKey'],
      type: 'foreign key',
      name: 'flog_userKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });

    // FmsFileDownloadLogsYYYYMM
    await queryInterface.addConstraint('FmsFileDownloadLogsYYYYMM', {
      fields: ['downloadTargetUserKey'],
      type: 'foreign key',
      name: 'ffdlog_downloadTargetUserKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
    await queryInterface.addConstraint('FmsFileDownloadLogsYYYYMM', {
      fields: ['fileDownloadUrlKey'],
      type: 'foreign key',
      name: 'ffdlog_fileDownloadUrlKey_fk',
      references: { // Required field
        table: 'FmsFileDownloadUrls',
        field: 'fileDownloadUrlKey',
      },
    });

    // FmsJwtRefreshTokens
    await queryInterface.addConstraint('FmsJwtRefreshTokens', {
      fields: ['userKey'],
      type: 'foreign key',
      name: 'fjrt_userKey_fk',
      references: { // Required field
        table: 'FmsUsers',
        field: 'userKey',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    
  }
};