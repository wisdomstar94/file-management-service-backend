'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { QueryTypes, Op } = require('sequelize');
const FmsCodeGroups = require('./FmsCodeGroups');
const FmsCodes = require('./FmsCodes');
const FmsUsers = require('./FmsUsers');
const FmsJwtRefreshTokens = require('./FmsJwtRefreshTokens');
const FmsPermissionGroups = require('./FmsPermissionGroups');
const FmsMenuCategorys = require('./FmsMenuCategorys');
const FmsMenus = require('./FmsMenus');
const FmsPermissions = require('./FmsPermissions');
const FmsPermissionGroupsUploads = require('./FmsPermissionGroupUploads');
const FmsCompanys = require('./FmsCompanys');
const FmsFiles = require('./FmsFiles');
const FmsFileImages = require('./FmsFileImages');
const FmsFileVersions = require('./FmsFileVersions');
const FmsFileDownloadUrls = require('./FmsFileDownloadUrls');
const FmsFileDownloadUrlAccessConditions = require('./FmsFileDownloadUrlAccessConditions');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
  // sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// declare sequelizes
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// declare models
db.FmsCodeGroups = FmsCodeGroups(sequelize, Sequelize);
db.FmsCodes = FmsCodes(sequelize, Sequelize);
db.FmsUsers = FmsUsers(sequelize, Sequelize);
db.FmsJwtRefreshTokens = FmsJwtRefreshTokens(sequelize, Sequelize);
db.FmsPermissionGroups = FmsPermissionGroups(sequelize, Sequelize);
db.FmsMenuCategorys = FmsMenuCategorys(sequelize, Sequelize);
db.FmsMenus = FmsMenus(sequelize, Sequelize);
db.FmsPermissions = FmsPermissions(sequelize, Sequelize);
db.FmsPermissionGroups = FmsPermissionGroups(sequelize, Sequelize);
db.FmsPermissionGroupUploads = FmsPermissionGroupsUploads(sequelize, Sequelize);
db.FmsCompanys = FmsCompanys(sequelize, Sequelize);
db.FmsFiles = FmsFiles(sequelize, Sequelize);
db.FmsFileImages = FmsFileImages(sequelize, Sequelize);
db.FmsFileVersions = FmsFileVersions(sequelize, Sequelize);
db.FmsFileDownloadUrls = FmsFileDownloadUrls(sequelize, Sequelize);
db.FmsFileDownloadUrlAccessConditions = FmsFileDownloadUrlAccessConditions(sequelize, Sequelize);

// define association
db.FmsCodes.hasMany(db.FmsCodeGroups, { foreignKey: 'codeGroup', sourceKey: 'codeGroup' });
db.FmsCodeGroups.belongsTo(db.FmsCodes, { foreignKey: 'codeGroup', targetKey: 'codeGroup' });

db.FmsCodes.hasMany(db.FmsMenuCategorys, { foreignKey: 'menuCategoryStatus', sourceKey: 'code' });
db.FmsMenuCategorys.belongsTo(db.FmsCodes, { foreignKey: 'menuCategoryStatus', targetKey: 'code' });

db.FmsCodes.hasMany(db.FmsMenus, { foreignKey: 'menuStatus', sourceKey: 'code' });
db.FmsMenus.belongsTo(db.FmsCodes, { as: 'FmsCodesMenuStatus', foreignKey: 'menuStatus', targetKey: 'code' });

db.FmsMenus.hasMany(db.FmsMenus, { foreignKey: 'parentMenuKey', sourceKey: 'menuKey' });
db.FmsMenus.belongsTo(db.FmsMenus, { as: 'FmsMenusParent', foreignKey: 'parentMenuKey', targetKey: 'menuKey' });

db.FmsMenuCategorys.hasMany(db.FmsMenus, { foreignKey: 'menuCategoryKey', sourceKey: 'menuCategoryKey' });
db.FmsMenus.belongsTo(db.FmsMenuCategorys, { foreignKey: 'menuCategoryKey', targetKey: 'menuCategoryKey' });

db.FmsMenus.hasMany(db.FmsPermissions, { foreignKey: 'menuKey', sourceKey: 'menuKey' });
db.FmsPermissions.belongsTo(db.FmsMenus, { foreignKey: 'menuKey', sourceKey: 'menuKey' });

db.FmsCodes.hasMany(db.FmsPermissionGroups, { foreignKey: 'permissionGroupStatus', sourceKey: 'code' });
db.FmsPermissionGroups.belongsTo(db.FmsCodes, { foreignKey: 'permissionGroupStatus', sourceKey: 'code' });

db.FmsPermissionGroups.hasMany(db.FmsPermissionGroupUploads, { foreignKey: 'permissionGroupKey', sourceKey: 'permissionGroupKey' });
db.FmsPermissionGroupUploads.belongsTo(db.FmsPermissionGroups, { foreignKey: 'permissionGroupKey', sourceKey: 'permissionGroupKey' })

db.FmsPermissions.hasMany(db.FmsPermissionGroupUploads, { foreignKey: 'permissionKey', sourceKey: 'permissionKey' });
db.FmsPermissionGroupUploads.belongsTo(db.FmsPermissions, { foreignKey: 'permissionKey', sourceKey: 'permissionKey' });

db.FmsUsers.hasMany(db.FmsUsers, { foreignKey: 'parentUserKey', sourceKey: 'userKey' });
db.FmsUsers.belongsTo(db.FmsUsers, { as: 'FmsParentUsers', foreignKey: 'parentUserKey', sourceKey: 'userKey' });

db.FmsCodes.hasMany(db.FmsUsers, { foreignKey: 'userStatus', sourceKey: 'code' });
db.FmsUsers.belongsTo(db.FmsCodes, { as: 'FmsUserStatusCodes', foreignKey: 'userStatus', sourceKey: 'code' });

db.FmsCodes.hasMany(db.FmsUsers, { foreignKey: 'userLevel', sourceKey: 'code' });
db.FmsUsers.belongsTo(db.FmsCodes, { as: 'FmsUserLevelCodes', foreignKey: 'userLevel', sourceKey: 'code' });

db.FmsCompanys.hasMany(db.FmsUsers, { foreignKey: 'companyKey', sourceKey: 'companyKey' });
db.FmsUsers.belongsTo(db.FmsCompanys, { foreignKey: 'companyKey', sourceKey: 'companyKey' });

db.FmsPermissionGroups.hasMany(db.FmsUsers, { foreignKey: 'permissionGroupKey', sourceKey: 'permissionGroupKey' });
db.FmsUsers.belongsTo(db.FmsPermissionGroups, { foreignKey: 'permissionGroupKey', sourceKey: 'permissionGroupKey' });

// db.FmsUsers.hasMany(db.FmsCompanys, { foreignKey: 'updaterUserKey', sourceKey: 'userKey' });
// db.FmsCompanys.belongsTo(db.FmsUsers, { as: 'FmsUpdaterUsers', foreignKey: 'updaterUserKey', sourceKey: 'userKey' });

// db.FmsUsers.hasMany(db.FmsCompanys, { foreignKey: 'createrUserKey', sourceKey: 'userKey' });
// db.FmsCompanys.belongsTo(db.FmsUsers, { as: 'FmsCreaterUsers', foreignKey: 'createrUserKey', sourceKey: 'userKey' });

db.FmsCodes.hasMany(db.FmsCompanys, { foreignKey: 'companyStatus', sourceKey: 'code' });
db.FmsCompanys.belongsTo(db.FmsCodes, { as: 'FmsCompanyStatusCodes', foreignKey: 'companyStatus', sourceKey: 'code' });

db.FmsUsers.hasMany(db.FmsFiles, { foreignKey: 'createrUserKey', sourceKey: 'userKey' });
db.FmsFiles.belongsTo(db.FmsUsers, { as: 'FmsCreaterUsers', foreignKey: 'createrUserKey', sourceKey: 'userKey' });

db.FmsUsers.hasMany(db.FmsFiles, { foreignKey: 'updaterUserKey', sourceKey: 'userKey' });
db.FmsFiles.belongsTo(db.FmsUsers, { as: 'FmsUpdaterUsers', foreignKey: 'updaterUserKey', sourceKey: 'userKey' });

db.FmsCodes.hasMany(db.FmsFiles, { foreignKey: 'fileStatus', sourceKey: 'code' });
db.FmsFiles.belongsTo(db.FmsCodes, { as: 'FmsFileStatusCodes', foreignKey: 'fileStatus', sourceKey: 'code' });

db.FmsCodes.hasMany(db.FmsFileImages, { foreignKey: 'fileImageType', sourceKey: 'code' });
db.FmsFileImages.belongsTo(db.FmsCodes, { as: 'FmsFileImageTypeCodes', foreignKey: 'fileImageType', sourceKey: 'code' });

db.FmsFiles.hasMany(db.FmsFileImages, { foreignKey: 'fileKey', sourceKey: 'fileKey' });
db.FmsFileImages.belongsTo(db.FmsFiles, { as: 'FmsFiles', foreignKey: 'fileKey', sourceKey: 'fileKey' });

db.FmsCodes.hasMany(db.FmsFileImages, { foreignKey: 'fileImageStatus', sourceKey: 'code' });
db.FmsFileImages.belongsTo(db.FmsCodes, { as: 'FmsFileImageStatusCodes', foreignKey: 'fileImageStatus', sourceKey: 'code' });

db.FmsFiles.hasMany(db.FmsFileVersions, { foreignKey: 'fileKey', sourceKey: 'fileKey' });
db.FmsFileVersions.belongsTo(db.FmsFiles, { as: 'FmsFiles', foreignKey: 'fileKey', sourceKey: 'fileKey' });

db.FmsUsers.hasMany(db.FmsFileVersions, { foreignKey: 'updaterUserKey', sourceKey: 'userKey' });
db.FmsFileVersions.belongsTo(db.FmsUsers, { as: 'FmsUpdaterUsers', foreignKey: 'updaterUserKey', sourceKey: 'userKey' });

db.FmsUsers.hasMany(db.FmsFileVersions, { foreignKey: 'createrUserKey', sourceKey: 'userKey' });
db.FmsFileVersions.belongsTo(db.FmsUsers, { as: 'FmsCreaterUsers', foreignKey: 'createrUserKey', sourceKey: 'userKey' });

db.FmsCodes.hasMany(db.FmsFileVersions, { foreignKey: 'fileVersionStatus', sourceKey: 'code' });
db.FmsFileVersions.belongsTo(db.FmsCodes, { as: 'FmsFileVersionStatusCodes', foreignKey: 'fileVersionStatus', sourceKey: 'code' });

db.FmsUsers.hasMany(db.FmsFileDownloadUrls, { foreignKey: 'downloadTargetUserKey', sourceKey: 'userKey' });
db.FmsFileDownloadUrls.belongsTo(db.FmsUsers, { as: 'FmsFileDownloadUrlTargetUsers', foreignKey: 'downloadTargetUserKey', sourceKey: 'userKey' });

db.FmsFiles.hasMany(db.FmsFileDownloadUrls, { foreignKey: 'fileKey', sourceKey: 'fileKey' });
db.FmsFileDownloadUrls.belongsTo(db.FmsFiles, { as: 'FmsTargetFiles', foreignKey: 'fileKey', sourceKey: 'fileKey' });

db.FmsFileVersions.hasMany(db.FmsFileDownloadUrls, { foreignKey: 'fileVersionKey', sourceKey: 'fileVersionKey' });
db.FmsFileDownloadUrls.belongsTo(db.FmsFileVersions, { as: 'FmsTargetFileVersions', foreignKey: 'fileVersionKey', sourceKey: 'fileVersionKey' });

db.FmsUsers.hasMany(db.FmsFileDownloadUrls, { foreignKey: 'createrUserKey', sourceKey: 'userKey' });
db.FmsFileDownloadUrls.belongsTo(db.FmsUsers, { as: 'FmsCreaterUsers', foreignKey: 'createrUserKey', sourceKey: 'userKey' });

db.FmsUsers.hasMany(db.FmsFileDownloadUrls, { foreignKey: 'updaterUserKey', sourceKey: 'userKey' });
db.FmsFileDownloadUrls.belongsTo(db.FmsUsers, { as: 'FmsUpdaterUsers', foreignKey: 'updaterUserKey', sourceKey: 'userKey' });

db.FmsCodes.hasMany(db.FmsFileDownloadUrls, { foreignKey: 'fileDownloadUrlStatus', sourceKey: 'code' });
db.FmsFileDownloadUrls.belongsTo(db.FmsCodes, { as: 'FmsFileDownloadUrlStatusCodes', foreignKey: 'fileDownloadUrlStatus', sourceKey: 'code' });

db.FmsFileDownloadUrls.hasMany(db.FmsFileDownloadUrlAccessConditions, { foreignKey: 'fileDownloadUrlKey', sourceKey: 'fileDownloadUrlKey' });
db.FmsFileDownloadUrlAccessConditions.belongsTo(db.FmsFileDownloadUrls, { as: 'FmsFileDownloadUrls', foreignKey: 'fileDownloadUrlKey', sourceKey: 'fileDownloadUrlKey' });

db.FmsCodes.hasMany(db.FmsFileDownloadUrlAccessConditions, { foreignKey: 'conditionType', sourceKey: 'code' });
db.FmsFileDownloadUrlAccessConditions.belongsTo(db.FmsCodes, { as: 'FmsFileDownloadAccessConditionTypeCodes', foreignKey: 'conditionType', sourceKey: 'code' });

db.FmsUsers.hasMany(db.FmsFileDownloadUrlAccessConditions, { foreignKey: 'createrUserKey', sourceKey: 'userKey' });
db.FmsFileDownloadUrlAccessConditions.belongsTo(db.FmsUsers, { as: 'FmsCreaterUsers', foreignKey: 'createrUserKey', sourceKey: 'userKey' });

db.FmsUsers.hasMany(db.FmsFileDownloadUrlAccessConditions, { foreignKey: 'updaterUserKey', sourceKey: 'userKey' });
db.FmsFileDownloadUrlAccessConditions.belongsTo(db.FmsUsers, { as: 'FmsUpdaterUsers', foreignKey: 'updaterUserKey', sourceKey: 'userKey' });

db.FmsCodes.hasMany(db.FmsFileDownloadUrlAccessConditions, { foreignKey: 'conditionStatus', sourceKey: 'code' });
db.FmsFileDownloadUrlAccessConditions.belongsTo(db.FmsCodes, { as: 'FmsFileDownloadAccessConditionStatusCodes', foreignKey: 'conditionStatus', sourceKey: 'code' });









db.isActivePermission = async(userKey, permissionKey) => {
  const userInfo = await db.FmsUsers.findOne({
    where: {
      userKey: userKey,
    },
  });

  if (userInfo === null) {
    return false;
  }

  const permissionGroupUploadInfo = await db.FmsPermissionGroupUploads.findOne({
    where: {
      permissionGroupKey: userInfo.permissionGroupKey,
      permissionKey: permissionKey,
      isActive: 'Y',
      isDeletedRow: 'N',
    },
  });

  if (permissionGroupUploadInfo === null) {
    return false;
  }

  return true;
};



db.isActivePermissions = async(userKey, permissionKeys) => {
  const userInfo = await db.FmsUsers.findOne({
    where: {
      userKey: userKey,
    },
  });

  if (userInfo === null) {
    return [];
  }

  const permissionGroupUploadInfo = await db.FmsPermissionGroupUploads.findAll({
    attributes: ['permissionKey'],
    where: {
      permissionGroupKey: userInfo.permissionGroupKey,
      permissionKey: {
        [Op.in]: permissionKeys,
      },
      isActive: 'Y',
      isDeletedRow: 'N',
    },
  });

  const activePermissionKeyList = permissionGroupUploadInfo.map((x) => {
    return x.permissionKey;
  });
  return activePermissionKeyList;
};



db.isExistTable = async(tableName) => {
  const result = await sequelize.query(`
      SHOW TABLES IN ${process.env.MAIN_DB_DEFAULT_DATABASE} LIKE ${sequelize.escape(tableName)};
    `, { 
      type: QueryTypes.SELECT 
    }
  );

  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
};



// export module
module.exports = db;
