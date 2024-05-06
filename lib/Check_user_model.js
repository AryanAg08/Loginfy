
async function CheckUsermodel (usermodel) {
    if (typeof usermodel === 'function') {
        const fields = Object.keys(usermodel.schema.paths);
        
        return true;
    }
}

function CheckEmail (parms) {
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

function CheckPass (parms) {
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

function CheckUserName(parms) {
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
    CheckUsermodel,
    CheckEmail,
    CheckPass,
    CheckUserName
}