const check_regular_express = function(params) {
  let result = false;
  switch(params.type) {
    // 이메일 형식이 맞는지 체크
    case 'email': 
      // /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/
      // /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      // /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      if (params.str.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i) != null) {
        result = true;
      }
      break;
    
    // 비밀번호 형식 1번 : 숫자, 영문 반드시 포함되어 있는지 체크
    case 'password_type_1': 
      result = (params.str.match(/[0-9]/) && (params.str.match(/[a-z]/) || params.str.match(/[A-Z]/)));
      break;
    
    // 비밀번호 형식 2번 : 숫자, 영문, 특수기호 반드시 포함되어 있는지 체크
    case 'password_type_2': 
      result = (params.str.match(/[0-9]/) && (params.str.match(/[a-z]/) || params.str.match(/[A-Z]/)) && params.str.match(/[\!\@\#\$\%\^\&\*\(\)\_\-\+\=\\\`\~\[\]\{\}\;\'\"\/\.\,]/));
      break;
    
    // 비밀번호 형식 3번 : 숫자, 소문자, 대문자, 특수기호 반드시 포함되어 있는지 체크
    case 'password_type_3': 
      result = (params.str.match(/[0-9]/) && params.str.match(/[a-z]/) && params.str.match(/[A-Z]/) && params.str.match(/[\!\@\#\$\%\^\&\*\(\)\_\-\+\=\\\`\~\[\]\{\}\;\'\"\/\.\,]/));
      break;
    
    // 한글이 포함되어 있는지 체크 (euc-kr 인 경우)
    case 'korean_euckr':
      if (params.str.match(/[가-힣]/) != null) {
        result = true;
      }
      break;
    
    // 한글이 포함되어 있는지 체크 (utf-8 인 경우)
    case 'korean_utf8':
      if (params.str.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/) != null) {
        result = true;
      }
      break;
    
    // 영문이 포함되어 있는지 체크
    case 'english':
      result = (params.str.match(/[a-z]/) || params.str.match(/[A-Z]/));
      break;
    
    // 영문만 있는지 체크
    case 'english_only':
      if (params.str.match(/[^a-zA-Z]/) == null) {
        result = true;
      }
      break;
    
    // 영문 또는 숫자만 있는지 체크
    case 'english_number':
      if (params.str.match(/[^a-zA-Z0-9]/) == null) {
        result = true;
      }
      break;
    
    // 영문과 숫자만 있는지 체크
    case 'english_number_only':
      if (params.str.match(/[^a-zA-Z0-9]/) == null && params.str.match(/[a-zA-Z]/) != null && params.str.match(/[0-9]/) != null) {
        result = true;
      }
      break;
    
    // 숫자가 포함되어 있는지 체크
    case 'number':
      if (params.str.match(/[0-9]/) != null) {
        result = true;
      }
      break;
    
    // 숫자만 있는지 체크
    case 'number_only':
      if (params.str.match(/[^0-9]/) == null && params.str != "") {
        result = true;
      }
      break;
    
    // 특수기호가 포함되어 있는지 체크
    case 'special_char':
      if (params.str.match(/[\!\@\#\$\%\^\&\*\(\)\_\-\+\=\\\`\~\[\]\{\}\;\'\"\/\.\,]/) != null) {
        result = true;
      }
      break;
    
    // 특수기호만 있는지 체크
    case 'special_char_only':
      if (params.str.match(/[^\!\@\#\$\%\^\&\*\(\)\_\-\+\=\\\`\~\[\]\{\}\;\'\"\/\.\,]/) == null) {
        result = true;
      }
      break;
    
    // 전화번호 형식이 맞는지 체크 (지역 전화번호, 휴대폰 번호 모두 허용)
    case 'tel': 
      if (params.str.match(/^\d{2,3}-\d{3,4}-\d{4}$/)) {
        result = true;
      }
      break;
    
    default:
    
      break;
  }
  
  return result;
};

module.exports = check_regular_express;

