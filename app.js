(async() => {
 
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

  // my librarys
  const myLogger = require('./routes/librarys/myLogger');

  const redis = require('redis');
  const RedisStore = require('connect-redis')(session);
  // const RedisClient = redis.createClient(process.env.MAIN_REDIS_PORT, process.env.MAIN_REDIS_IP);
  const RedisClient = redis.createClient({
    password: process.env.MAIN_REDIS_PW,
    legacyMode: true,
  });
  RedisClient.on('error', () => {
    console.log('@@@redis client error!');
  });
  RedisClient.on('connect', () => {
    console.log('@@@redis client connect!');
  });
  await RedisClient.connect();
  // await RedisClient.auth({ password: process.env.MAIN_REDIS_PW }, (err) => {
  //   console.log('err', err);
  // });
  await RedisClient.auth(process.env.MAIN_REDIS_PW, (err) => {
    console.log('err', err);
  });

  const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  // my middlewares
  const setRequestUnique = require('./routes/middlewares/setRequestUnique');
  const setRequestInfoLogging = require('./routes/middlewares/setRequestInfoLogging');
  const checkIPPermission = require('./routes/middlewares/checkIPPermission');
  const errorHandler = require('./routes/middlewares/errorHandler');
  const sequelizeTest = require('./routes/middlewares/sequelizeTest');

  // crons
  const fmsFileDownloadLogsTableCreateCron = require('./crons/fms_file_download_logs_table_create');
  const fmsLogsTableCreateCron = require('./crons/fms_logs_table_create');
  // const db_init_check_cron = require('./crons/db_init_check.js.legacy');

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

  // csrf
  const csrfMiddleware = csrf();

  // cors
  const corsMiddleware = cors(corsOptions);

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
      // host: process.env.MAIN_REDIS_IP,
      // port: process.env.MAIN_REDIS_PORT,
      // pass: process.env.MAIN_REDIS_PW,
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
  // app.use(csrf());
  // app.use(cors(corsOptions));
  // app.use(cors());


  // static path match
  app.use('/public', express.static(path.join(__dirname, 'static', 'files/')));
  app.use('/favicon.ico', express.static(path.join(__dirname, 'static', 'files', 'images', 'favicon/favicon.ico')));

  // router match
  app.use('/api/code', checkIPPermission, corsMiddleware, apiCodeRouter);
  app.use('/api/codeGroup', checkIPPermission, corsMiddleware, apiCodeGroupRouter);
  app.use('/api/user', checkIPPermission, corsMiddleware, apiUserRouter);
  app.use('/api/menuCategory', checkIPPermission, corsMiddleware, apiMenuCategoryRouter);
  app.use('/api/menu', checkIPPermission, corsMiddleware, apiMenuRouter);
  app.use('/api/permission', checkIPPermission, corsMiddleware, apiPermissionRouter);
  app.use('/api/permissionGroup', checkIPPermission, corsMiddleware, apiPermissionGroupRouter);
  app.use('/api/permissionGroupUpload', checkIPPermission, corsMiddleware, apiPermissionGroupUploadRouter);
  app.use('/api/company', checkIPPermission, corsMiddleware, apiCompanyRouter);
  app.use('/api/file', checkIPPermission, corsMiddleware, apiFileRouter);
  app.use('/api/fileVersion', checkIPPermission, corsMiddleware, apiFileVersionRouter);
  app.use('/api/fileDownloadUrl', checkIPPermission, corsMiddleware, apiFileDownloadUrlRouter);
  app.use('/api/dashboard', checkIPPermission, corsMiddleware, apiDashboardRouter);
  app.use('/api/download', corsMiddleware, apiDownloadRouter);

  // static path setup
  // app.use(express.static(path.join(__dirname, 'public')));
  // app.use('/sync/port', express.static(path.join(__dirname, '/client/')));
  app.use('/file/image', checkIPPermission, express.static(path.join(__dirname, '..', '/filesImages/')));

  app.use('/file/download', csrfMiddleware, angularFrontRouter);

  app.use(express.static(path.join(__dirname, '/client/')));
  app.use('*', csrfMiddleware, checkIPPermission, angularFrontRouter);

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
})();



