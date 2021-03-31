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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.FmsCodeGroups = FmsCodeGroups(sequelize, Sequelize);
db.FmsCodes = FmsCodes(sequelize, Sequelize);
db.FmsUsers = FmsUsers(sequelize, Sequelize);
db.FmsJwtRefreshTokens = FmsJwtRefreshTokens(sequelize, Sequelize);
db.FmsPermissionGroups = FmsPermissionGroups(sequelize, Sequelize);
db.FmsMenuCategorys = FmsMenuCategorys(sequelize, Sequelize);


db.FmsCodes.hasMany(db.FmsCodeGroups, { foreignKey: 'codeGroup', sourceKey: 'codeGroup' });
db.FmsCodeGroups.belongsTo(db.FmsCodes, { foreignKey: 'codeGroup', targetKey: 'codeGroup' });

db.FmsCodes.hasMany(db.FmsMenuCategorys, { foreignKey: 'menuCategoryStatus', sourceKey: 'code' });
db.FmsMenuCategorys.belongsTo(db.FmsCodes, { foreignKey: 'menuCategoryStatus', targetKey: 'code' });

module.exports = db;
