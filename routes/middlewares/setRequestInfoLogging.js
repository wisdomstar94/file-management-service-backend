const requestIP = require('request-ip');
const geoip = require('geoip-lite');
const path = require('path');

const myLogger = require('../librarys/myLogger');
const myGetFileNameAndType = require('../librarys/myGetFileNameAndType').myGetFileNameAndType;

const setRequestInfoLogging = function(req, res, next) {
  // 요청온 IP 주소
  const clientIP = requestIP.getClientIp(req);

  // 아래 확장자들에 대해서는 header나 body값을 로그 출력하지 않음.
  const notLoggingFileType = [
    'jpg', 'jpeg', 'png', 'gif', 'ico', // 이미지 파일

    'txt', // 텍스트 파일

    'js', 'css', // js 및 css 파일
  ];

  // ex) /public/images/favicons/favicon.png 일 경우 favicon.png
  const request_url_file_basename = path.basename(req.url); 

  // ex) { file_only_name: 'favicon', file_only_type: 'png' }
  const request_url_file_basename_info = myGetFileNameAndType({
    full_file_name: request_url_file_basename
  }); 

  const request_url_file_basename_file_name = request_url_file_basename_info.file_only_name; // ex) favicon
  const request_url_file_basename_file_type = request_url_file_basename_info.file_only_type; // ex) png

  // req 객체에 real_ip 심기
  req.real_ip = clientIP;

  // console.log('req', req);
  // console.log('req.hostname', req.hostname);
  req.is_localling = false;
  req.front_base_url = '';
  if (req.hostname === 'localhost') {
    req.is_localling = true;
    req.front_base_url = 'http://localhost:4200';
  }

  // 로그 미출력 대상이 아니면
  if (!notLoggingFileType.includes(request_url_file_basename_file_type)) {
    myLogger.info(req.logHeadTail + '=================================================================================================================');
    myLogger.info(req.logHeadTail + '▦▦▦▦▦▦▦  ' + req.method + ' ' + req.url + '  ▦▦▦▦▦▦▦');
    myLogger.info(req.logHeadTail + 'request ip address : ' + clientIP);
    myLogger.info(req.logHeadTail + 'request ip info : ' + JSON.stringify(geoip.lookup(clientIP)));
    myLogger.info(req.logHeadTail + 'request hostname : ' + req.hostname);
    myLogger.info(req.logHeadTail + 'request path : ' + req.path);
    myLogger.info(req.logHeadTail + 'request originalUrl : ' + req.originalUrl);
    myLogger.info(req.logHeadTail + 'request header : ' + JSON.stringify(req.headers));
    myLogger.info(req.logHeadTail + 'request cookies : ' + JSON.stringify(req.cookies));
    myLogger.info(req.logHeadTail + 'request body : ' + JSON.stringify(req.body));
    myLogger.info(req.logHeadTail + 'request query : ' + JSON.stringify(req.query));
    myLogger.info(req.logHeadTail + 'request params : ' + JSON.stringify(req.params));
  }

  next();
};

module.exports = setRequestInfoLogging;
