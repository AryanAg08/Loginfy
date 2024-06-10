class AuthStrategy {
    constructor() {
        if (new.target === AuthStrategy) {
            throw new Error('Cannot construct AuthStrategy instances directly');
        }
    }

    setOptions(options) {};
    async login(req,res,next) {};
    async logout(req,res) {};
    async signup(req,res,next) {};
}

module.exports = AuthStrategy;