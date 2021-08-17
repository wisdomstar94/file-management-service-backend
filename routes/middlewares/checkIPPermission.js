const requestIP = require('request-ip');
const geoip = require('geoip-lite');
const path = require('path');

const myLogger = require('../librarys/myLogger');
const myGetFileNameAndType = require('../librarys/myGetFileNameAndType').myGetFileNameAndType;
const myIPChecker = require('../librarys/myIPChecker');
const allow_ip = require('../../allow_ip');

const checkIPPermission = function(req, res, next) {
  // 허용 ip 가 없다면, 전체 허용으로 간주
  myLogger.info(req.logHeadTail + 'checkIPPermission 미들웨어 진입');
  myLogger.info(req.logHeadTail + 'allow_ip => ' + JSON.stringify(allow_ip, null, 2));
  if (allow_ip.length === 0) {
    next();
    return;
  }

  // 요청온 IP 주소
  const clientIP = requestIP.getClientIp(req);

  // 요청온 IP 주소가 허용 IP 주소에 포함되어 있는지 체크
  const is_match = myIPChecker.ipCheck({
    allow_ip_list: allow_ip,
    request_ip: clientIP,
  });

  // 포함되어 있지 않다면 접근 막기
  if (!is_match) {
    res.status(403).end();
    return;
  }

  next();
  return;
};

module.exports = checkIPPermission;
