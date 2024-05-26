const crypto = require("crypto");
function HashPassword (password, salt) {
    return crypto.createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}
function comparePassword (_Userpassword, _HashPassword, salt) {
    const Plain_to_hash_password = HashPassword(_Userpassword, salt);
  return Plain_to_hash_password == _HashPassword;
}

const salt = require("../crenditals/data").salt;

function Check_CompareSync (_Userpassword, _HashPassword) {
    const IsMatch = comparePassword(_Userpassword, _HashPassword, salt);

    return IsMatch;
}

function CreateHash (password) {
    return HashPassword(password, salt);
}

module.exports = {Check_CompareSync, CreateHash};