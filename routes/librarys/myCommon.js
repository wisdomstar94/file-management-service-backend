exports.specialCharEscape = function(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // return str;
  // return '[' + str + ']';
  return str.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, "\\$&");
};

