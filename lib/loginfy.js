/**
 * @typedef {Object} LoginOptions
 * @property {boolean} Email - Enable email login.
 * @property {boolean} Password - Enable password login.
 * @property {boolean} UserName - Enable username login.
 */

/**
 * @typedef {Object} Options
 * @property {boolean} samesite - SameSite cookie attribute.
 * @property {LoginOptions} loginOptions - Options for login methods.
 * @property {Array} usermodel - Array to store user models.
 * @property {Object|null} TokenStorage_model - Model for token storage.
 * @property {string} Secret - Secret key for tokens.
 * @property {number} TokenExpiry - Token expiry time in hours.
 * @property {boolean} CookieSigned - Whether the cookie is signed.
 * @property {number} CokkieMaxAge - Maximum age for cookies in milliseconds.
 */

/**
 * Default options object.
 * @type {Options}
 */
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { checkEmail, checkUsermodel, checkPass, checkUserName } = require("./check-user-model");
const {Check_CompareSync, CreateHash } = require("./compare-sync");

const DEFAULT_OPTIONS = {
    samesite: false,
    loginOptions: {
      Email: true,
      Password: true,
      UserName: false,
    },
    usermodel: [],
    secret: "lognify",
    tokenExpiry: 24,
    cookieSigned: true,
    cokkieMaxAge: 1000 * 60 * 60 * 24,
  };
  
  /**
   * Set options by merging with the default options.
   * @param {Partial<Options>} options - Options to override.
   */

  const GLOBAL_OPTIONS = {
    Email: null,
    Password: null,
    UserName: null,
    Function_used: false,
}

// Modules Exports

exports.setOptions = (options = {}) => {
    Object.assign(DEFAULT_OPTIONS, options);
    module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
  };    

exports.use = () => {
    const options = {...DEFAULT_OPTIONS, ...Object.options};
       GLOBAL_OPTIONS.Function_used = true;
    // check if user has done email and username as false to both 
    if (options.loginOptions) {
        if (DEFAULT_OPTIONS.loginOptions.Email == false && DEFAULT_OPTIONS.loginOptions.UserName == false) 
            throw new error("Email and UserName both parameters cannot be set false!! \n Select atleast one Parameter true!!")
    }
       
    if (options.usermodel) {           
            const MODEL_EXISTS = checkUsermodel(DEFAULT_OPTIONS.usermodel);
            if (MODEL_EXISTS) {
                const PARM1 = {
                    Email: DEFAULT_OPTIONS.loginOptions.Email,
                    model: DEFAULT_OPTIONS.usermodel
                }
                const CHECK_MAIL = checkEmail(PARM1);
                if (CHECK_MAIL) GLOBAL_OPTIONS.Email = CHECK_MAIL;
                else if (CHECK_MAIL === false) {
                    // check for user's username!! 
                
                    const CHECK_USERNAME = checkUserName({Name: DEFAULT_OPTIONS.loginOptions.UserName, model: DEFAULT_OPTIONS.usermodel});
                    if (CHECK_USERNAME) GLOBAL_OPTIONS.UserName = CHECK_USERNAME;
                    else if (CHECK_USERNAME === false) return;
                    else throw new error(`USerNmae is not passed in in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the UserName OR checkout the offical Docs!!!`)
                }
                else throw new error (`Email is not passed in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the Email OR checkout the offical Docs!!!`);
                const CHECK_PASS = checkPass({Password: DEFAULT_OPTIONS.loginOptions.Password, model: DEFAULT_OPTIONS.usermodel});
                if (CHECK_PASS) GLOBAL_OPTIONS.Password = CHECK_PASS;
                else throw new error (`Password is not passed in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the Password OR checkout the offical Docs!!!`);
            }    
         
       }  

       else {
        // create a model for the user 
     

        generateUserModel();

        /**
         * About: This function genrates the usermodel for login and signup for the user, if it doesn't exists!!
         * Function Params: none
         * Function Output: Creates the usermodel in client's directory!! It reads the userModelTemplate and copy-paste it in the user's directory for simplification!!
         *                  And updates the DEFAULT_VARIABLES.usermodel!!
         */
        function generateUserModel() {
            const userModelTemplatePath = path.join(__dirname, ".", 'utils', 'user-model-template.js');
            const userProjectDir = process.cwd(); 

            fs.readFile(userModelTemplatePath, 'utf-8', (err, data) => {
                if (err) {
                    throw new error (`Error is opening model file!!`, err);
                    return;
                }

                const UserModelFilePath = path.join(userProjectDir, 'usermodel.js');
                fs.writeFile(UserModelFilePath, data, 'utf-8' , (err) => {
                    if (err) {
                        throw new error("Error in wrtiting model!", err);
                        return;
                    }
                    // else model will be created automatically!!
                    const FILE_EXISTS = fs.existsSync(`${userProjectDir}/usermodel.js`);
                    if (FILE_EXISTS) DEFAULT_OPTIONS.usermodel = require(`${userProjectDir}/usermodel.js`);
                    else throw new error ("Unable to locate the Model File!!");
                })
            })
        }
        
    }
    
}


exports.login = async (req, res, next) => {
   
      let {email, password} = req.body;
      
      console.log(`Enabling Login feature at ${req.originalUrl}!! \n Listening to email, passworkd property!!`);
      if (!email || !password) res.status(400).json("Missing Fields!");
      else {
        email = email.toLowerCase();

        if (
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
        ) {
            res.status(400).json("Invalid Email Format!!");
        }
        else {
              const user = await DEFAULT_OPTIONS.usermodel.findOne({email: email});
              if (user && Check_CompareSync(password, user.password, user.salt)) {
                const token = jwt.sign({ id: user._id}, DEFAULT_OPTIONS.secret, { expiresIn: `${DEFAULT_OPTIONS.tokenExpiry}h` });
                res.cookie('jwt', token, {
                    signed: DEFAULT_OPTIONS.cookieSigned,
                    maxAge: DEFAULT_OPTIONS.cokkieMaxAge,
                });
                res.status(200).json(user); 
            }
            else {
                res.status(400).json("Invalid Credentials!!");
            }
        }
        }
}

exports.logout = (req, res) => {
    console.log(`Enabling logout feature at ${req.originalUrl}!!`);
    res.clearCookie('jwt').json('logout');
}

exports.singup = async (req, res, next) => {
    let {email, password, username} = req.body;
    if (!email || !password || !username) res.status(400).json("Missing Fields!!");
    else {
        email = email.toLowerCase();
        if (
            !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
        ) {
            res.status(400).json("Invalid Email Format!!");
        }
        else {
            const user = await DEFAULT_OPTIONS.usermodel.findOne({email: email});
            if (user) res.status(400).json("Email already exists!!");
            else {
                const salt = crypto.randomBytes(16).toString('hex');
                const HashedPassword = CreateHash(password, salt);
                const newUser = new DEFAULT_OPTIONS.usermodel({
                    email,
                    password: HashedPassword,
                    salt,
                    username,
                });
                await newUser.save();
                res.status(200).json("User Created!!");
            }
        }
    }
}