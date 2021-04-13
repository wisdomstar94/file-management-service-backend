'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
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

db.FmsCodes.hasMany(db.FmsUsers, { foreignKey: 'userStatus', sourceKey: 'code' });
db.FmsUsers.belongsTo(db.FmsCodes, { foreignKey: 'userStatus', sourceKey: 'code' });

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

// export module
module.exports = db;
