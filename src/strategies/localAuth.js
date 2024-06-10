/** 
 * @typedef {Object} AuthOptions
 * @property {string} password - Password for the user from req.body.
 * @property {string} jwtSecret - The secret for jwt to be wrapped with.
 * @property {number} tokenExpiry - Time for the expiry of the jwt token 
 * @property {Array} usermodel - usermodel for getting user info!!
 */
const jwt = require("jsonwebtoken");

const AuthStrategy = require("../AuthStrategy");
const { checkCompareSync } = require("../utils/Encrypt");

class LocalAuth extends AuthStrategy {

    constructor() {
        super();
        this.options = {
            password: '',
            jwtSecret: "loginfy",
            tokenExpiry: 24,
            usermodel: [],
        }
    }
        setOptions(options) {
            this.options = options;
        }

        async login(email, password) {
            const userEmail = email.toLowerCase();
            const user = await this.options.usermodel.findOne({email: userEmail});
            const checkPass = checkCompareSync(password, user.password, user.salt);
            if (user && checkPass) {
                 const generateToken = jwt.sign({id: user._id}, this.options.jwtSecret, {expiresIn: `${this.options.tokenExpiry}h`});
                 const getUserData = user;
                 const data = {
                    ...generateToken,
                    ...getUserData
                 }

                 return data;
            }
            else {
                if (!user) throw new error("User not found in the database!");
                else if (!checkPass) throw new error("Password do not match the existing one!");
            }
        }
}