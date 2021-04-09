exports.specialCharEscape = function(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // return str;
  // return '[' + str + ']';
  return str.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, "\\$&");
};


exports.isNumber = function(val) {
  if (val === null || val === undefined) {
    return false;
  }

  if (typeof val === 'object') {
    return false;
  }

  if (typeof val === 'string') {
    if (val.trim() === '') {
      return false;
    }
  }

  if (isNaN(Number(val))) {
    return false;
  }

  return true;
};
