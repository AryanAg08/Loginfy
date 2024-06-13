/** 
 * @typedef {Object} AuthOptions
 * @property {string} password - Password for the user from req.body.
 * @property {string} jwtSecret - The secret for jwt to be wrapped with.
 * @property {number} tokenExpiry - Time for the expiry of the jwt token 
 * @property {Array} usermodel - usermodel for getting user info!!
 */
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

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

     #generateUserModel() {
        const userModelTemplate = path.join(__dirname, "..", 'utils', 'user-model-template.js');
        const userProjectDirectory = process.cwd();
     
        fs.readFile(userModelTemplate, 'utf-8', (err, data) => {
         if (err) {
             throw new Error(`Error writing model file: ${err}`);
         }
         
         const userModelFilePath = path.join(userProjectDirectory, 'usermodel.js');
         fs.writeFile(userModelFilePath, data, 'utf-8', (err) => {
             if (err) {
                 throw new Error(`Error writing model file: ${err}`);
             }
     
             const filePath = `${userProjectDirectory}/usermodel.js` || `${userModelTemplate}/${"models"|| "model"}/usermodel.js`;
         const file_exists = fs.existsSync(filePath);
         if (file_exists) {
             this.options.usermodel = require(filePath);
         }
         else {
             throw new Error("Unable to locate the model File!!");
         }
         });
     });
     };

        setOptions(options) {
            this.options = options;

            if (this.options.usermodel.length === 0 ) {
                this.#generateUserModel();
            }
        }

        async login (req, res, next) {
            this._validateRequest(req);
            
            const { email, password } = req.body;
            const { usermodel } = this.options;
            const user = usermodel.find(user => user.email === email);
            if (!user) {
                // return res.status(404).json({ message: "User not found" }); 
                this._setStatus(200, "User not found!!");
            }
            const { password: hashPassword, salt } = user;
            const isMatch = checkCompareSync(password, hashPassword, salt);
            if (!isMatch) {
                // return res.status(401).json({ message: "Invalid credentials" });
                this._setStatus(200, "Invalid crenditals!!");
            }
            const token = jwt.sign({ email }, this.options.jwtSecret, { expiresIn: this.options.tokenExpiry });
          //  res.status(200).json({ token });
             this._setStatus(100, "ok!");
             const data = {
                token: token,
                data: user
             }
             return data;
        }

    
};


