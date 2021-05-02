
const myLogger = require('./myLogger');

exports.ipCheck = function(params) {
	myLogger.info('ipCheck() 함수 호출됨');
	myLogger.info('params.allow_ip_list => ' + JSON.stringify(params.allow_ip_list));
	myLogger.info('params.request_ip => ' + params.request_ip);

  // 허용 ip 수 만큼 반복문 돌기
  let is_allow_ip_match = false;
  for (let i=0; i<params.allow_ip_list.length; i++) {
    let allow_ip = params.allow_ip_list[i]; // ex) 154.22.333.25, 180.255.231.0/24,
    let allow_ip_split = allow_ip.split('.');
		let check_ip = '';
		
		let target_request_ip = params.request_ip;

		if (target_request_ip.includes('::ffff:')) {
			// 요청 보내온 클라이언트의 ip 주소가 ipv4 주소로 변환 가능한 ipv6 인 경우
			target_request_ip = target_request_ip.replace('::ffff:', '');
		}

    if (allow_ip == '0.0.0.0') {
      is_allow_ip_match = true;
      break;
		}
    
    if (allow_ip.includes('/8')) {
      check_ip = allow_ip_split[0];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 허용 ip 규칙에 맞으면
        is_allow_ip_match = true;
        break;
      }
    } else if (allow_ip.includes('/16')) {
      check_ip = allow_ip_split[0] + '.' + allow_ip_split[1];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 허용 ip 규칙에 맞으면
        is_allow_ip_match = true;
        break;
      }
    } else if (allow_ip.includes('/24')) {
      check_ip = allow_ip_split[0] + '.' + allow_ip_split[1] + '.' + allow_ip_split[2];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 허용 ip 규칙에 맞으면
        is_allow_ip_match = true;
        break;
      }
    } else if (allow_ip.includes('/32')) {
      check_ip = allow_ip_split[0] + '.' + allow_ip_split[1] + '.' + allow_ip_split[2] + '.' + allow_ip_split[3].split('/')[0];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 허용 ip 규칙에 맞으면
        is_allow_ip_match = true;
        break;
      }
    } else {
      // check_ip = allow_ip_split[0] + '.' + allow_ip_split[1] + '.' + allow_ip_split[2] + '.' + allow_ip_split[3];
      check_ip = allow_ip;
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 허용 ip 규칙에 맞으면
        is_allow_ip_match = true;
        break;
      }
    }
  }
  
  return is_allow_ip_match;
};




exports.ipBlockCheck = function(params) {
	myLogger.info(params.req.logHeadTail + 'ipBlockCheck() 함수 호출됨');
	// myLogger.info('blocked_ip_list => ' + JSON.stringify(blocked_ip_list));
	// myLogger.info('request_ip => ' + request_ip);

  // 차단대상 ip 수 만큼 반복문 돌기
  let is_block_ip_match = false;
  for (let i=0; i<params.blocked_ip_list.length; i++) {
    let block_ip = params.blocked_ip_list[i]; // ex) 154.22.333.25, 180.255.231.0/24, ...
    let block_ip_split = block_ip.split('.');
		let check_ip = '';
		
		let target_request_ip = params.request_ip;

		// if (target_request_ip.includes('::ffff:')) {
		// 	// 요청 보내온 클라이언트의 ip 주소가 ipv4 주소로 변환 가능한 ipv6 인 경우
		// 	target_request_ip = target_request_ip.replace('::ffff:', '');
		// }
    
    if (block_ip.includes('/8')) {
      check_ip = block_ip_split[0];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 차단대상 ip 규칙에 맞으면
        is_block_ip_match = true;
        break;
      }
    } else if (block_ip.includes('/16')) {
      check_ip = block_ip_split[0] + '.' + block_ip_split[1];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 차단대상 ip 규칙에 맞으면
        is_block_ip_match = true;
        break;
      }
    } else if (block_ip.includes('/24')) {
      check_ip = block_ip_split[0] + '.' + block_ip_split[1] + '.' + block_ip_split[2];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 차단대상 ip 규칙에 맞으면
        is_block_ip_match = true;
        break;
      }
    } else if (block_ip.includes('/32')) {
      check_ip = block_ip_split[0] + '.' + block_ip_split[1] + '.' + block_ip_split[2] + '.' + block_ip_split[3].split('/')[0];
      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 차단대상 ip 규칙에 맞으면
        is_block_ip_match = true;
        break;
      }
    } else {
      check_ip = block_ip;

      if (target_request_ip.includes(check_ip)) {
        // 요청 ip가 차단대상 ip 규칙에 맞으면
        is_block_ip_match = true;
        break;
      }
    }
  }
  
  return is_block_ip_match;
};