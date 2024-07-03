const querystring = require("querystring");
const axios = require('axios');
const AuthStrategy = require("../AuthStrategy");

/**
 * Class for Discord Authentication
 * @extends AuthStrategy
 */

/**
* @typedef {object} AuthOptions
* @property {string} clientId - The client ID for the Discord OAuth.
* @property {string} clientSecret - The client Secret for the Discord OAuth.
* @property {string} redirectUri - The Redirect URL for the OAuth callback.
* @property {string} scope - The scope of OAuth permissions.
 */

class DiscordAuth extends AuthStrategy {
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
   * SetOptions: 
   * Set Options for the Discord Authentication. 
   * 
   * For getting the Discord Credentials check out https://discord.com/developers/docs/topics/oauth2
   * 
   * 
   * **Options:**
   * 1. `clientId` : The discord Client ID. 
   * 2. `clientSecret` : The discord Client Secret.
   * 3. `redirectUri` : The redirect Url for your Authentication.
   * 4. `scope` : The scope of your Application. Deafult is *identify email*
   * 
   * **Note: The redirectUrl and the URL at the discord application must match!!**
   * 
   * 
   * @param {AuthOptions} options - The Options for Authentication.
   * @param {string} options.clientId - The client ID for the Discord OAuth.
   * @param {string} options.clientSecret - The client Secret for the Discord OAuth.
   * @param {string} options.redirectUri - The Redirect URL for the OAuth callback.
   * @param {string} [options.scope] - Optional. The scope of the authentication request.
   * 
   */
  setOptions(options) {
    this.options = options;

    if (!this.options.scope) {
      this.options.scope = "identify email";
    }
    if (!this.options.clientId && !this.options.clientSecret) {
      return this._setStatus(400, "ClientId/ClientSecret not set!!");
    } else if (!this.options.redirectUri) {
      return this._setStatus(400, "Redirect Uri not set!!");
    }
  }

  login(instance) {
    if (!(instance instanceof DiscordAuth)) {
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
          response_type: 'code',
          scope: this.options.scope
        });


        res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
      }
    }
  }

  callback(instance) {
    if (!(instance instanceof DiscordAuth)) {
      throw new TypeError('Expected an instance of DiscordAuth');
    }

    return async (req, res, next) => {
      var baseurl = `${req.protocol}://${req.headers.host}`;
      const { code } = req.query;
      try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', querystring.stringify({
          client_id: this.options.clientId,
          client_secret: this.options.clientSecret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `${baseurl}${this.options.redirectUri}`
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });


        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
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
    if (!(instance instanceof DiscordAuth)) {
      throw new Error('logout() must be called on an instance of DiscordAuth');
    }

    return (req, res, next) => {
      req.session.destroy();
      res.logout();

      next();
    }
  }


  signup(instance) {
    if (!(instance instanceof DiscordAuth)) {
      throw new Error('signup() must be called on an instance of DiscordAuth');
    }

    return async (req, res, next) => {
      try {
        const { code } = req.query;
        var baseurl = `${req.protocol}://${req.headers.host}`;
        const tokenResponse = await axios.post(`https://discord.com/api/oauth2/token`, querystring.stringify({
          client_id: instance.options.clientId,
          client_secret: instance.options.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: `${baseurl}${this.options.redirectUrl}`
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${access_token}` }
        });

        req.session.access_token = access_token;
        req.session.user = userResponse.data;
        req.user = userResponse.data;

        next();
      } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: 'Failed to process signup' });
      }
    }
  }
}

module.exports = DiscordAuth;
