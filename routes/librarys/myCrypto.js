const crypto = require('crypto');
const aes256 = require('aes256');
const md5 = require('md5');
require('dotenv').config();
const ivLength = 16;

exports.encrypt = function(params) {
	const iv = crypto.randomBytes(ivLength);
	let encrypt_key = process.env.ENCRYPT_KEY;
	if (typeof params.encrypt_key === 'string') {
		encrypt_key = params.encrypt_key;
	}
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encrypt_key), iv);
	let encrypted = cipher.update(params.originalValue);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex'); // 같은 문자열이더라도 다른 해쉬값이 나옴
};

exports.decrypt = function(params) {
	const textParts = params.hashedValue.split(':');
	const iv = Buffer.from(textParts.shift(), 'hex');
	const encryptedText = Buffer.from(textParts.join(':'), 'hex');
	let encrypt_key = process.env.ENCRYPT_KEY;
	if (typeof params.encrypt_key === 'string') {
		encrypt_key = params.encrypt_key;
	}
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encrypt_key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString(); // 다른 해쉬값이더라도 같은 문자열이 나올 수 있음
};

exports.oneRootEncrypt = function(params) {
	const key = crypto.pbkdf2Sync(params.originalValue, process.env.ONE_ROOT_ENCRYPT_SALT, 100000, 64, 'sha512');
	return key.toString('hex'); // 복호화 불가능한 해쉬 값, 같은 문자열당 같은 해쉬값이 나옴
};

exports.pbkdf2 = function(params) {
	const result = crypto.pbkdf2Sync(params.originalValue, params.salt, params.repeatCount, params.byte, 'sha512').toString('hex');
	return result; // 복호화 불가능한 해쉬 값, salt 값에 따라 같은 문자열이라도 다른 해쉬값이 나옴
};

exports.md5Encrypt = function(params) {
	// const result = crypto.createHash('md5').update(params.originalValue).digest('hex');
	const result = md5(params.originalValue);
	return result;
};

exports.encryptAES256 = function(params) {
	let encrypt_key = process.env.ENCRYPT_KEY;
	if (typeof params.encrypt_key === 'string') {
		encrypt_key = params.encrypt_key;
	}
	const result = aes256.encrypt(encrypt_key, params.originalValue);
	return result;
};

exports.decryptAES256 = function(params) {
	let encrypt_key = process.env.ENCRYPT_KEY;
	if (typeof params.encrypt_key === 'string') {
		encrypt_key = params.encrypt_key;
	}
	const result = aes256.decrypt(encrypt_key, params.hashedValue);
	return result;
};