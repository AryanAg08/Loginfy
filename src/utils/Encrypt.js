const crypto = require("crypto");
function hashPassword (password, salt) {
    return crypto.createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}
function comparePassword (_Userpassword, _HashPassword, salt) {
    const Plain_to_hash_password = HashPassword(_Userpassword, salt);
  return Plain_to_hash_password == _HashPassword;
}

// const salt = require("../crenditals/data").salt;

function checkCompareSync (_Userpassword, _HashPassword, salt) {
    const IsMatch = comparePassword(_Userpassword, _HashPassword, salt);

    return IsMatch;
}

function createHash (password, salt) {
    return hashPassword(password, salt);
}

module.exports = {checkCompareSync, createHash};