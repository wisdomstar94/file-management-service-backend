// npm modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const logger = require('morgan');
const compression = require('compression');
// const geoip = require('geoip-lite');
// const requestIP = require('request-ip');
const csrf = require("csurf");
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const RedisClient = redis.createClient(process.env.MAIN_REDIS_PORT, process.env.MAIN_REDIS_IP);
const redisConnectionResult = RedisClient.auth(process.env.MAIN_REDIS_PW, function(err) {
  if (err) {
    console.log('Redis 에러 발생');
    console.log(err, " 에러 발생했습니다.");
  } else {
    console.log('Redis 연결 성공');
  }
});

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// my librarys
const myLogger = require('./routes/librarys/myLogger');

// my middlewares
const setRequestUnique = require('./routes/middlewares/setRequestUnique');
const setRequestInfoLogging = require('./routes/middlewares/setRequestInfoLogging');
const checkIPPermission = require('./routes/middlewares/checkIPPermission');
const errorHandler = require('./routes/middlewares/errorHandler');
const sequelizeTest = require('./routes/middlewares/sequelizeTest');

// crons
const fmsFileDownloadLogsTableCreateCron = require('./crons/fms_file_download_logs_table_create');
const fmsLogsTableCreateCron = require('./crons/fms_logs_table_create');

// sequelize
const sequelize = require('./models').sequelize;

// router declare
const angularFrontRouter = require('./routes/angularFront');

const apiCodeRouter = require('./routes/api/code/index');
const apiCodeGroupRouter = require('./routes/api/codeGroup/index');
const apiUserRouter = require('./routes/api/user/index');
const apiMenuCategoryRouter = require('./routes/api/menuCategory/index');
const apiMenuRouter = require('./routes/api/menu/index');
const apiPermissionRouter = require('./routes/api/permission/index');
const apiPermissionGroupRouter = require('./routes/api/permissionGroup/index');
const apiPermissionGroupUploadRouter = require('./routes/api/permissionGroupUpload/index');
const apiCompanyRouter = require('./routes/api/company/index');
const apiFileRouter = require('./routes/api/file/index');
const apiFileVersionRouter = require('./routes/api/fileVersion/index');
const apiFileDownloadUrlRouter = require('./routes/api/fileDownloadUrl/index');
const apiDashboardRouter = require('./routes/api/dashboard/index');
const apiDownloadRouter = require('./routes/api/download/index');

// express declare
const app = express();

// sequelize sync
sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setup
app.set('port', process.env.PORT);

// middlewares setup
app.use(setRequestUnique);
app.use(sequelizeTest);
app.use(compression());
// app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.raw());
app.use(express.text());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET_KEY,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000,
    // sameSite: 'strict'
  },
  store: new RedisStore({
    client: RedisClient,
    host: process.env.MAIN_REDIS_IP,
    port: process.env.MAIN_REDIS_PORT,
    pass: process.env.MAIN_REDIS_PW,
    logErrors: true,
  }),
}))
// app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({
  policy: 'same-origin'
}));
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     styleSrc: ["'self'", "'unsafe-inline'", "'nonce'"],
//     scriptSrc: ["'self'"],
//     connectSrc: ["'self'"]
//   },
// }))
app.use(setRequestInfoLogging);
app.use(csrf());
// app.use(cors(corsOptions));
// app.use(cors());


// static path match
app.use('/public', express.static(path.join(__dirname, 'static', 'files/')));

// router match
app.use('/api/code', apiCodeRouter);
app.use('/api/codeGroup', apiCodeGroupRouter);
app.use('/api/user', apiUserRouter);
app.use('/api/menuCategory', apiMenuCategoryRouter);
app.use('/api/menu', apiMenuRouter);
app.use('/api/permission', apiPermissionRouter);
app.use('/api/permissionGroup', apiPermissionGroupRouter);
app.use('/api/permissionGroupUpload', apiPermissionGroupUploadRouter);
app.use('/api/company', apiCompanyRouter);
app.use('/api/file', apiFileRouter);
app.use('/api/fileVersion', apiFileVersionRouter);
app.use('/api/fileDownloadUrl', apiFileDownloadUrlRouter);
app.use('/api/dashboard', apiDashboardRouter);
app.use('/api/download', apiDownloadRouter);

// static path setup
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/sync/port', express.static(path.join(__dirname, '/client/')));
app.use('/file/image', express.static(path.join(__dirname, '..', '/filesImages/')));

app.use('/file/download', angularFrontRouter);
app.use('*', checkIPPermission, angularFrontRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

// listen
app.listen(app.get('port'), function(){
  myLogger.info(app.get('port') + ' port listening...');
});

