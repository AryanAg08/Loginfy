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
const crypto = require("node:crypto")

const AuthStrategy = require("../AuthStrategy");
const { checkCompareSync, createHash } = require("../utils/Encrypt");

class LocalAuth extends AuthStrategy {

    constructor() {
        super();
        this.options = {
          //  password: '',
            jwtSecret: "",
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

                const filePath = `${userProjectDirectory}/usermodel.js` || `${userModelTemplate}/${"models" || "model"}/usermodel.js`;
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
          console.log(options);
        if (!(this.options.usermodel)) {
            this.#generateUserModel();
        }
    }

    login (instance) {
    if (!(instance instanceof LocalAuth)) {
        throw new ErrorEvent("Invalid instance passed to login function");
    }

   return async (req, res, next) => {
    console.log("working in login!!")
        try {
            console.log("inside try")
            this._validateRequest(req);

            const { email, password } = req.body;
            const { usermodel } = this.options;
            const user = await usermodel.findOne({email: email});
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
            try {
            const token = jwt.sign({ email }, this.options.jwtSecret, { expiresIn: this.options.tokenExpiry });
            //  res.status(200).json({ token });
            this._setStatus(100, "Successful Login!!");
            const data = {
                token: token,
                data: user
            }
            req.user = user;
            req.tokenResponse = token;
            next();
        }
        catch (err) {
              return this._setStatus(300, err);
        }
    } 
        catch (err) {
            next(err);
        }
    }
   } 

     logout (instance) {
        if (!(instance instanceof LocalAuth)) {
            throw new error('this is not a valid instance for localAuth');
        }

      return async (req, res, next) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Logout failed' });
            }
            res.json({ message: 'Logged out successfully' });
            return this._setStatus(600, "Local Auth Logout!!")
        });
            next();
           
        }
    
    }

    signup (instance) {
    if (!(instance instanceof LocalAuth)) {
        throw new ErrorEvent("Invalid instance passed to login function");
    }
   return async (req, res, next) => {
        const { email, password } = req.body;
        const { usermodel } = this.options;

        if (!email || !password) {
            return this._setStatus(200, "Missing Fields!!");
        }

        const userEmail = email.toLowerCase();

        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(userEmail)) {
            return this._setStatus(200, "Invalid Email!!");
        }

        const exisitingUser = await usermodel.findOne({ email: userEmail});
        if (exisitingUser) {
            return this._setStatus(200, "Email already exists!!");
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashPassword = createHash(password, salt);
        const newUser = new usermodel({
            email: userEmail,
            password: hashPassword,
            salt,
        });

        await newUser.save();
        try {
        const token = jwt.sign({ email: userEmail }, this.options.jwtSecret, { expiresIn: this.options.tokenExpiry});
        
        this._setStatus(100, "User signed up successfully!!");
        const UserInfo = {
            email: email,
            salt: salt,
        }
        const data = {
            token: token,
            data: UserInfo,
        }
        req.user = UserInfo;
        req.tokenResponse = token;
        next();
    }
    catch(err) {
        return this._setStatus(300, err);
    }
    }

   }

};


module.exports = LocalAuth;