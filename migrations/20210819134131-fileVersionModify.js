'use strict';
const db = require('../models');
const { Op, Sequelize } = require('sequelize');
const myGetMakeToken = require('../routes/librarys/myGetMakeToken').myGetMakeToken;
require('dotenv').config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // 신규 권한 삽입
    const newPermissions = [
      {

        menuKey: 'Ig1617524166484wTSHK',
        permissionKey: 'kFqlnMS1629362524666', 
        permissionName: '파일 목록-상세정보-파일버전정보-목록-파일용량 표시',
        permissionDescription: '파일의 상세정보중 파일버전정보의 목록에서 파일용량 표시 여부',
        sortNo: 5060,
        createdIp: '::ffff:172.17.0.1',
      },
      {
        menuKey: 'Ig1617524166484wTSHK',
        permissionKey: 'wLaZVRy1629376506306', 
        permissionName: '파일 목록-상세정보-파일버전정보-목록-파일다운로드버튼 표시',
        permissionDescription: '파일의 상세정보중 파일버전정보의 목록에서 파일다운로드버튼 표시 여부',
        sortNo: 5061,
        createdIp: '::ffff:172.17.0.1',
      },
    ];
    await db.FmsPermissions.bulkCreate(newPermissions);

    // 최고 관리자 권한 그룹에 신규 권한 삽입
    const rootAdminPermissionGroupResult = await db.FmsPermissionGroups.findOne({
      where: {
        permissionGroupKey: 'T1617773784543MKLRZn',
      },
    });

    if (rootAdminPermissionGroupResult !== null) {
      await db.FmsPermissionGroupUploads.bulkCreate([
        {
          permissionGroupUploadKey: 'bJe1629376506306zyPf',
          permissionGroupKey: 'T1617773784543MKLRZn',
          permissionKey: 'kFqlnMS1629362524666',
          createdIp: '::ffff:172.17.0.1',
        },
        {
          permissionGroupUploadKey: 'NXIWIj1629376506307E',
          permissionGroupKey: 'T1617773784543MKLRZn',
          permissionKey: 'wLaZVRy1629376506306',
          createdIp: '::ffff:172.17.0.1',
        },
      ]);
    }
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
