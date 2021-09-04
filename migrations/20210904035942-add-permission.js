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
        permissionKey: 'W1630728058303LTVtCe', 
        permissionName: '파일 목록-상세정보-발급된 파일 다운로드 URL 목록-파일다운로드 로그 접근 가능',
        permissionDescription: '파일의 상세정보중 발급된 파일 다운로드 URL 목록에서 파일다운로드 로그 접근 가능 여부',
        sortNo: 8410,
        createdIp: '::ffff:172.17.0.1',
      },
      {
        menuKey: 'njHLKh1617524193166T',
        permissionKey: 'OGxfF1630728058303mG', 
        permissionName: '파일 다운로드 현황-파일 다운로드 URL 별 로그 접근 가능',
        permissionDescription: '파일 다운로드 현황-파일 다운로드 URL 별 로그 접근 가능 여부',
        sortNo: 1410,
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
          permissionGroupUploadKey: 'R1630728058304mlTETS',
          permissionGroupKey: 'T1617773784543MKLRZn',
          permissionKey: 'W1630728058303LTVtCe',
          createdIp: '::ffff:172.17.0.1',
        },
        {
          permissionGroupUploadKey: 'pbFxh1630728058304bg',
          permissionGroupKey: 'T1617773784543MKLRZn',
          permissionKey: 'OGxfF1630728058303mG',
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
