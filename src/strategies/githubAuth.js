/**
 * @typedef {Object} AuthOptions
 * @property {string} clientId - The client ID for the GitHub OAuth.
 * @property {string} clientSecret - The client secret for the GitHub OAuth.
 * @property {string} redirectUri - The redirect URI for the OAuth callback.
 * @property {string} scope - The scope of the OAuth permissions.
 */


const AuthStrategy = require("../AuthStrategy");
/**
 * @implements {AuthStrategy}
 */
class GithubAuth extends AuthStrategy {
    /**
     * Creates an instance of GithubAuth.
     */
    constructor() {
        super();
        /**
         * @type {AuthOptions}
         */
        this.options = {
            clientId: '',
            clientSecret: '',
            redirectUri: '',
            scope: ''
        };
    }

    /**
     * Sets the options for GitHub authentication.
     * @param {AuthOptions} options - The authentication options.
     */
    setOptions(options) {
        this.options = options;
    }
    async login(req, res, next) {
        console.log("github login!!");
    }

    async logout(req, res) {
        console.log("github logout!");
    }

    async signup(req, res, next) {
      console.log("github signup!!");
    }
}

module.exports = GithubAuth;
