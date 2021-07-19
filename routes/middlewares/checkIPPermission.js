const requestIP = require('request-ip');
const geoip = require('geoip-lite');
const path = require('path');

const myLogger = require('../librarys/myLogger');
const myGetFileNameAndType = require('../librarys/myGetFileNameAndType').myGetFileNameAndType;
const myIPChecker = require('../librarys/myIPChecker');

const checkIPPermission = function(req, res, next) {
  // 요청온 IP 주소
  // const clientIP = requestIP.getClientIp(req);

  // const allow_ip = [
  //   '0.0.0.0/24',
  // ];

  // const is_match = myIPChecker.ipCheck({
  //   allow_ip_list: allow_ip,
  //   request_ip: clientIP,
  // });

  // if (!is_match) {
  //   res.status(403).end();
  //   return;
  // }

  next();
};

module.exports = checkIPPermission;
