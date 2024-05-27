const mongo = require("mongoose");

const UserModel = new mongo.Schema({
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    UserName: {
        type: String,
        required: true,
        unique: true,
    },
    Salt: {
        type: String,
        required: true,
    }
});

module.exports = mongo.model("Usermodel", UserModel);