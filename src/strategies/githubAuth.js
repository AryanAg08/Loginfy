const querystring = require("querystring");
const axios = require('axios');
const AuthStrategy = require("../AuthStrategy");

// Work on the GithubAuth

/**
 * Class for Github Authentication
 * @class
 * @augments AuthStrategy
 */

/**
* @typedef {object} AuthOptions
* @property {string} clientId - The client ID for the Github OAuth.
* @property {string} clientSecret - The client Secret for the Github OAuth.
* @property {string} redirectUri - The Redirect URL for the OAuth callback.
* @property {string} scope - The scope of OAuth permissions.
 */

class GithubAuth extends AuthStrategy {
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
   * @inheritdoc
  */
  setOptions(options) {
    this.options = options;

    if (!this.options.scope) {
      this.options.scope = "user";
    }
    if (!this.options.clientId && !this.options.clientSecret) {
      return this._setStatus(400, "ClientId/ClientSecret not set!!");
    } else if (!this.options.redirectUri) {
      return this._setStatus(400, "Redirect Uri not set!!");
    }
  }

  login(instance) {
    if (!(instance instanceof GithubAuth)) {
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
          scope: this.options.scope
        });
        console.log(params);

        res.redirect(`https://github.com/login/oauth/authorize?${params}`);
      }
    }
  }

  callback(instance) {
    if (!(instance instanceof GithubAuth)) {
      throw new TypeError('Expected an instance of GithubAuth');
    }

    return async (req, res, next) => {
      var baseurl = `${req.protocol}://${req.headers.host}`;
      const { code } = req.query;
      try {
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', querystring.stringify({
          client_id: this.options.clientId,
          client_secret: this.options.clientSecret,
          code: code,
          redirect_uri: `${baseurl}${this.options.redirectUri}`
        }), {
          headers: {
            'Accept': 'application/json'
          }
        });


        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://api.github.com/user', {
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
    if (!(instance instanceof GithubAuth)) {
      throw new Error('logout() must be called on an instance of GithubAuth');
    }

    return (req, res, next) => {
      req.session.destroy();
      res.logout();

      next();
    }
  }


  signup(instance) {
    if (!(instance instanceof GithubAuth)) {
      throw new Error('signup() must be called on an instance of GithubAuth');
    }

    return async (req, res, next) => {
      var baseurl = `${req.protocol}://${req.headers.host}`;
      if (req.session.user) {
        return res.redirect(this.options.redirectUri);
      } else {
        const params = querystring.stringify({
          client_id: this.options.clientId,
          redirect_uri: `${baseurl}${this.options.redirectUri}`,
          scope: this.options.scope
        });
        console.log(params);

        res.redirect(`https://github.com/login/oauth/authorize?${params}`);
      }
    }
  }
}

module.exports = GithubAuth;
