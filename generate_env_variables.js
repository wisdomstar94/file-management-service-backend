const myGetRandomNumber = function(params) {
  const ranNum = Math.floor(Math.random() * (params.max - params.min + 1)) + params.min;
  return ranNum;
};

const myGetRandomString = function(params) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  for (let i = 0; i < params.str_length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const myGetMakeToken = function(params) {
  const timestamp = new Date().getTime();
  const timestamp_length = timestamp.toString().length;
  const str_max_length = params.strlength - timestamp_length;
  const first_length = myGetRandomNumber({
    min: 1, 
    max: str_max_length
  });
  const second_length = str_max_length - first_length;
  return ''.concat(
    myGetRandomString({
      str_length: first_length
    }),
    new Date().getTime(),
    myGetRandomString({
      str_length: second_length
    })
  );
};

const env = {
  ENCRYPT_KEY: myGetMakeToken({ strlength: 32 }),
  ONE_ROOT_ENCRYPT_SALT: myGetMakeToken({ strlength: 56 }),
  COOKIE_SECRET_KEY: myGetMakeToken({ strlength: 40 }),
  JWT_SECRET: myGetMakeToken({ strlength: 32 }),
  JWT_FILE_DOWNLOAD_URL_SECRET: myGetMakeToken({ strlength: 32 }),
};

console.log('env', env);
