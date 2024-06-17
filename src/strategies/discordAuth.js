/**
 * @typedef {object} AuthOptions
 * @property {string} clientId - The client ID for the Discord OAuth.
 * @property {string} clientSecret - The client Secret for the Discord OAuth.
 * @property {string} redirectUri - The Redirect URL for the OAuth callback.
 * @property {string} scope - The scope of OAuth permisssions. 
 */

const querystring = require("querystring");

const AuthStrategy = require("../AuthStrategy");
/**
 * @implements {AuthStrategy}
 */

class DiscordAuth extends AuthStrategy {
    constructor() {
        super();

        /**
         * @type {AuthOptions}
         */
        this.options = {
            clientId: "",
            clientSecret: "",
            redirectUri: "",
            scope: "identify email",
        };

    }

          /**
           * @param {AuthOptions} options - The Options for Authentication.
           */
     setOptions(options) {
                this.options = options;
                if (!this.options.clientId && !this.options.clientSecret) {
                    return this._setStatus(400, "ClientId/ClientSecret not set!!");
                }
                else if (!this.options.redirectUri) {
                    return this._setStatus(400, "Redirect Uri not set!!");
                }
                
            }

            login(req, res, next) {
                if (req.session.user) {
                    return res.redirect(this.options.redirectUri);
                }
                else {
                    const params = querystring
                }
            }
}