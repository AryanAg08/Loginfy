
class AuthStrategy {
    constructor() {
        if (new.target === AuthStrategy) {
            throw new TypeError("Cannot construct AuthStrategy instances directly");
        }

        this.#colors = {
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m", 
            blue: "\x1b[34m"
        };

        this.#statusCodes = {
            100: 'OK',
            200: 'Validation Error',
            300: 'JWT Error',
            400: 'File System Error',
            500: 'Unknown Error'
        };

        this.#currentStatus = 100;  // Default status
    }

    #colors;
    #statusCodes;
    #currentStatus;

    /**
     * @param {number} code - Error Code!! 
     * @param {string} errMsg - Error Message!!
     */
    #setStatus(code, errMsg) {
        if (!this.#statusCodes[code]) {
            throw new Error('Invalid status code');
        }
        this.#currentStatus = code;
        if (this.#currentStatus !== 100) {
            this.#logError(code, errMsg);
            throw new Error(`Execution halted with status code: ${code}`);
        }
        else if (this.#currentStatus === 100) {
            const msg = "Status: ok!!"
            console.log(`${this.#colors.green}${msg}\x1b[0m`);
        }
    }

    /**
     * 
     * @param {Number} code - Error Code. 
     * @param {string} errMsg - Error Message.
     */
    #logError(code, errMsg) {
        const defaultMessage = `Error: ${this.#statusCodes[code]}`;
        const errorMessage = errMsg ? `${defaultMessage} - ${errMsg}` : defaultMessage;
        switch (code) {
            case 200:
                console.error(`${this.#colors.yellow}${errorMessage}\x1b[0m`);
                break;
            case 300:
                console.error(`${this.#colors.red}${errorMessage}\x1b[0m`);
                break;
            case 400:
                console.error(`${this.#colors.blue}${errorMessage}\x1b[0m`);
                break;
            default:
                console.error(errorMessage);
                break;
                
        }
        throw new Error(errorMessage);
    }
    /**
     * 
     * @param {object} req - request object for the process.  
     */
    #validateRequest(req) {
        if (!req || typeof req !== 'object') {
            this.#setStatus(200, 'Invalid request object');
        }
        if (!req.body || typeof req.body !== 'object') {
            this.#setStatus(200, 'Request body is missing or invalid');
        }
        this.#setStatus(100);
    }

   /**
    * 
    * @param {object} res - response object for the process. 
    */
    #validateResponse(res) {
        if (!res || typeof res !== 'object') {
            this.#setStatus(200, 'Invalid response object');
        }
        if (typeof res.status !== 'function' || typeof res.json !== 'function') {
            this.#setStatus(200, 'Response lacks status or json methods');
        }
        this.#setStatus(100);
    }

    #validateOptions(options) {
        // Base validation, can be extended in subclasses
        if (!options || typeof options !== 'object') {
            this.#setStatus(200, 'Options should be an object');
        }
        this.#setStatus(100);
    }

    _validateRequest(req) {
        this.#validateRequest(req);
    }

    _validateResponse(res) {
        this.#validateResponse(res);
    }

    _validateOptions(options) {
        this.#validateOptions(options);
    }

    _setStatus(code, errMsg) {
        this.#setStatus(code, errMsg);
    }

    setOptions(options) {};
    
    /**
     * @param {import('express').Request} req - request 
     * @param {import('express').Response} res - response
     * @param {import('express').NextFunction} next - Callback to pass control to the next middleware.
     */
    async login(req,res,next) {};
    async logout(req,res) {};
    async signup(req,res,next) {};
}

module.exports = AuthStrategy;