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

const { CheckEmail, CheckUsermodel, CheckPass } = require("./Check_user_model");
exports.use = () => {
    const options = {...DEFAULT_OPTIONS, ...obj.options};
       
    if (options.usermodel) {           
            const MODEL_EXISTS = CheckUsermodel(DEFAULT_OPTIONS.usermodel);
            if (MODEL_EXISTS) {
                const CHECK_MAIL = CheckEmail(DEFAULT_OPTIONS.loginOptions.Email, DEFAULT_OPTIONS.usermodel);
                if (CHECK_MAIL) GLOBAL_OPTIONS.Email = CHECK_MAIL;
                else if (CHECK_MAIL === false) {
                    // check for user's username!! 
                }
                else throw new error (`Email is not available in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the Email OR checkout the offical Docs!!!`);
                const CHECK_PASS = CheckPass(DEFAULT_OPTIONS.loginOptions.Password, DEFAULT_OPTIONS.usermodel);
                if (CHECK_PASS) GLOBAL_OPTIONS.Password = CHECK_PASS;
                else throw new error (`Password is not available in ${DEFAULT_OPTIONS.usermodel.collection.name}!! \n Speicfy a valid format of the Password OR checkout the offical Docs!!!`);
            }
         
       }  
    
}
module.exports.login = async (req, res) => {
     
}