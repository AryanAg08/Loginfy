const mongo = require("mongoose");

const UserModel = new mongo.Schema({
    email: {
        type: String,
        required: false,
        unique: false,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
        unique: false,
    },
    // phoneNo: {
    //     type: Number,
    //     required: false,
    //     unique: true,
    // },
    salt: {
        type: String,
        required: true,
    }
});

module.exports = mongo.model("Usermodel", UserModel);