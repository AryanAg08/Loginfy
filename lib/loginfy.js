const DEFAULT_OPTIONS = {
    samesite: false,
    loginOptions: {
        Email: true,
        Password: true,
        UserName: false,
    },
    usermodel: null
}

const GLOBAL_OPTIONS = {
    Email: null,
    Password: null,
    UserName: null
}

exports.setOptions = (options) => {
    Object.assign(DEFAULT_OPTIONS, options);  
  //  console.log(DEFAULT_OPTIONS)
} 

const { CheckEmail, CheckUsermodel, CheckPass, CheckUserName } = require("./Check_user_model");
exports.use = () => {
    const options = {...DEFAULT_OPTIONS, ...obj.options};

    // check if user has done email and username as false to both 
    if (options.loginOptions) {
        if (DEFAULT_OPTIONS.loginOptions.Email == false && DEFAULT_OPTIONS.loginOptions.UserName == false) 
            throw new error("Email and UserName both parameters cannot be set false!! \n Select atleast one Parameter true!!")
    }
       
    if (options.usermodel) {           
            const MODEL_EXISTS = CheckUsermodel(DEFAULT_OPTIONS.usermodel);
            if (MODEL_EXISTS) {
                const PARM1 = {
                    Email: DEFAULT_OPTIONS.loginOptions.Email,
                    model: DEFAULT_OPTIONS.usermodel
                }
                const CHECK_MAIL = CheckEmail(PARM1);
                if (CHECK_MAIL) GLOBAL_OPTIONS.Email = CHECK_MAIL;
                else if (CHECK_MAIL === false) {
                    // check for user's username!! 
                
                    const CHECK_USERNAME = CheckUserName({Name: DEFAULT_OPTIONS.loginOptions.UserName, model: DEFAULT_OPTIONS.usermodel});
                    if (CHECK_USERNAME) GLOBAL_OPTIONS.UserName = CHECK_USERNAME;
                    else if (CHECK_USERNAME === false) return;
                    else throw new error(`USerNmae is not passed in in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the UserName OR checkout the offical Docs!!!`)
                }
                else throw new error (`Email is not passed in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the Email OR checkout the offical Docs!!!`);
                const CHECK_PASS = CheckPass({Password: DEFAULT_OPTIONS.loginOptions.Password, model: DEFAULT_OPTIONS.usermodel});
                if (CHECK_PASS) GLOBAL_OPTIONS.Password = CHECK_PASS;
                else throw new error (`Password is not passed in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the Password OR checkout the offical Docs!!!`);
            }
            else {
                // create a model for the user 
                const fs = require("fs");
                const path = require("path");

                function generateUserModel() {
                    const userModelTemplatePath = path.join(__dirname, ".", 'utils', 'userModelTemplate.js');
                    const userProjectDir = process.cwd(); 

                    fs.readFile(userModelTemplatePath, 'utf-8', (err, data) => {
                        if (err) {
                            throw new error (`Error is opening model file!!`, err);
                            return;
                        }

                        const UserModelFilePath = path.join(userProjectDir, 'userModel.js');
                        fs.writeFile(UserModelFilePath, data, 'utf-8' , (err) => {
                            if (err) {
                                throw new error("Error in wrtiting model!", err);
                                return;
                            }
                            // else model will be created automatically!!
                            const FILE_EXISTS = fs.existsSync(`${userProjectDir}/userModel.js`);
                            if (FILE_EXISTS) DEFAULT_OPTIONS.usermodel = require(`${userProjectDir}/userModel.js`);
                            else throw new error ("Unable to locate the Model File!!");
                        })
                    })
                }
            }
         
       }  
    
}
module.exports.login = async (req, res) => {
     
}