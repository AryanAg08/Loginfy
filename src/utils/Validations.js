/**
 * 
 * About: This function checks if the model exists in the user's current working directory or not!! 
 * params: usermodel which is set my setopitons
 * output: returns true or false if exist or not!!
 */
async function checkUserModel (usermodel) {
    if (typeof usermodel === 'function') {
        const fields = Object.keys(usermodel.schema.paths);
        
        return true;
    }
}

/**
 * 
 * About: This function checks if the email exists in the user's current mongo model or not!! 
 * params: Object -> Email and usermodel
 * output: returns true or false if exist or not!!
 */
function checkEmail (parms) {
    const { Email, model } = parms;

    if (Email === true) {
        const fields = Object.keys(model.schema.paths);
        
        let EMAIL_FIELD = fields.filter(f => f.toLowerCase().includes('email'));

        if (EMAIL_FIELD) {
            return EMAIL_FIELD[0];
        } else {
            return null;
        }
    }
    else if (Email === false) {
        return false;
    }
}

/**
 * 
 * About: This function checks if the password exists in the user's current mongo model or not!! 
 * params: Object -> Password and usermodel
 * output: returns true or false if exist or not!!
 */
function checkPass (parms) {
    const { Password, model } = parms;

    if (Password === true) {
        const fields = Object.keys(model.schema.paths);
        
        let PASSWORD_FIELD = fields.filter(f => f.toLowerCase().includes('password'));

        if (PASSWORD_FIELD) {
            return PASSWORD_FIELD[0];
        } else {
            return null;
        }
    }

}

/**
 * 
 * About: This function checks if the username exists in the user's current mongo model or not!! 
 * params: Object -> username and usermodel
 * output: returns true or false if exist or not!!
 */
function checkUserName(parms) {
    const { Name, model } = parms;

    if (Name === true) {
        const fields = Object.keys(model.schema.paths);

        let USERNAME_FIELD = fields.filter(f  => f.toLowerCase().includes("user" || "name" || "username" || "userid" || "id"));

        if (USERNAME_FIELD) {
            return USERNAME_FIELD[0];
        }
        else if (Name === false) return false;
        else return null;
    }
}


module.exports = {
    checkUserModel,
    checkEmail,
    checkPass,
    checkUserName
}