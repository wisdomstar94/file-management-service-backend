// npm modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const geoip = require('geoip-lite');
const requestIP = require('request-ip');
const csrf = require("csurf");
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// my librarys
const wrapper = require('./routes/librarys/myAsyncWrapper');
const myLogger = require('./routes/librarys/myLogger');
const myGetMakeToken = require('./routes/librarys/myGetMakeToken').myGetMakeToken;

// my middlewares
const setRequestUnique = require('./routes/middlewares/setRequestUnique');
const setRequestInfoLogging = require('./routes/middlewares/setRequestInfoLogging');
const errorHandler = require('./routes/middlewares/errorHandler');

// router declare
const apiUserRouter = require('./routes/api/user/user');

// express declare
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// port setup
app.set('port', process.env.PORT);

// middlewares setup
app.use(setRequestUnique);
app.use(compression());
// app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.raw());
app.use(express.text());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.frameguard());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({
  policy: 'same-origin'
}));
app.use(setRequestInfoLogging);
app.use(cors());
// app.use(csrf());

// router match
app.use('/api/user', apiUserRouter);

// static path setup
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/sync/port', express.static(path.join(__dirname, '/client/')));

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

