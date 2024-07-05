const querystring = require("querystring");
const axios = require('axios');
const AuthStrategy = require("../AuthStrategy");

// Work on the GoogleAuth

/**
 * Class for Google Authentication
 * @class
 * @augments AuthStrategy
 */

/**
* @typedef {object} AuthOptions
* @property {string} clientId - The client ID for the Google OAuth.
* @property {string} clientSecret - The client Secret for the Google OAuth.
* @property {string} redirectUri - The Redirect URL for the OAuth callback.
* @property {string} scope - The scope of OAuth permissions.
 */

class GoogleAuth extends AuthStrategy {
  constructor() {
    super();

    /**
* Authorization Options: 
* 
* Options that are required to allows to fetch information about access token and their information (As per users wish).
* 
*/


    /**
     * @type {AuthOptions}
     */
    this.options = {
      clientId: "",
      clientSecret: "",
      redirectUri: "",
      scope: "",
    };
  }


  /**
   * 
   * @inheritdoc 
   */
  setOptions(options) {
    this.options = options;

    if (!this.options.scope) {
      this.options.scope = "profile email";
    }
    if (!this.options.clientId && !this.options.clientSecret) {
      return this._setStatus(400, "ClientId/ClientSecret not set!!");
    } else if (!this.options.redirectUri) {
      return this._setStatus(400, "Redirect Uri not set!!");
    }
  }

  login(instance) {
    if (!(instance instanceof GoogleAuth)) {
      throw new Error("Invalid instance passed to login function");
    }

    // Return a middleware function
    return (req, res, next) => {
      var baseurl = `${req.protocol}://${req.headers.host}`;
      if (req.session.user) {
        return res.redirect(this.options.redirectUri);
      } else {
        const params = querystring.stringify({
          client_id: this.options.clientId,
          redirect_uri: `${baseurl}${this.options.redirectUri}`,
          response_type: "code",
          scope: this.options.scope
        });
        console.log(params);

        res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
      }
    }
  }

  callback(instance) {
    if (!(instance instanceof GoogleAuth)) {
      throw new TypeError('Expected an instance of GoogleAuth');
    }

    return async (req, res, next) => {
      var baseurl = `${req.protocol}://${req.headers.host}`;
      const { code } = req.query;
      try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
          client_id: this.options.clientId,
          client_secret: this.options.clientSecret,
          code: code,
          redirect_uri: `${baseurl}${this.options.redirectUri}`,
          grant_type: "authorization_code"
        }), {
          headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
          }
        });


        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });

        req.session.access_token = access_token;
        req.session.user = userResponse.data;
        req.user = userResponse.data;
        req.tokenResponse = tokenResponse.data;

        next();
      } catch (err) {
        console.error('Error during OAuth2 process:', err.response ? err.response.data : err.message);
        //  this._setStatus(500, "Failed to fetch user information!!");
        res.status(500).json({ error: 'Failed to fetch user information' });
      }
    }
  }

  logout(instance) {
    if (!(instance instanceof GoogleAuth)) {
      throw new Error('logout() must be called on an instance of GoogleAuth');
    }

    return (req, res, next) => {
      req.session.destroy();
      res.logout();

      next();
    }
  }


  signup(instance) {
    if (!(instance instanceof GoogleAuth)) {
      throw new Error('signup() must be called on an instance of GoogleAuth');
    }

    return async (req, res, next) => {
      var baseurl = `${req.protocol}://${req.headers.host}`;
      if (req.session.user) {
        return res.redirect(this.options.redirectUri);
      } else {
        const params = querystring.stringify({
          client_id: this.options.clientId,
          redirect_uri: `${baseurl}${this.options.redirectUri}`,
          response_type: "code",
          scope: this.options.scope
        });
        console.log(params);

        res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
      }
    }
  }
}

module.exports = GoogleAuth;
