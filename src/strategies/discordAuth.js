const querystring = require("querystring");
const axios = require('axios');
const AuthStrategy = require("../AuthStrategy");

/**
 * Authorization Options: 
 * 
 * Options that are required to allows to fetch information about access token and their information (As per users wish).
 * 
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
         * @type {AuthOptions}
         */
        this.options = {
            clientId: "",
            clientSecret: "",
            redirectUri: "",
            redirectUrl: "",
            scope: "",
        };
    }

    /**
     * @param {AuthOptions} options - The Options for Authentication.
     */
    setOptions(options) {
      console.log("function called set options!!!!")
        this.options = options;
       
        if (!this.options.scope) {
          this.options.scope = "identify email";
        }
        console.log(this.options)
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
    return  (req, res, next) => {
      console.log("Function called!!");
      console.log(req);
      var baseurl = `${req.protocol}://${req.headers.host}`;
      if (req.session.user) {
          return res.redirect(this.options.redirectUri);
      } else {
          console.log(this.options);
          const params = querystring.stringify({
              client_id: this.options.clientId,
              redirect_uri: `${baseurl}${this.options.redirectUri}`,
              response_type: 'code',
              scope: this.options.scope
          });

          console.log(params)

          res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
      }
  }
}

    callback(instance) {
      if (!(instance instanceof DiscordAuth)) {
        throw new TypeError('Expected an instance of DiscordAuth');
      }

      return async  (req, res, next) => {
        var baseurl = `${req.protocol}://${req.headers.host}`;
        const { code } = req.query;
          // console.log(code);
        try {
          // console.log("in the ry!!")
          // console.log(this.options)
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

          // console.log(tokenResponse)
          const {access_token} = tokenResponse.data;

          const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
          });

          req.session.access_token = access_token;
          req.session.user = userResponse.data;
          req.user = userResponse.data;

          next();
        } catch (err) {
          console.error('Error during OAuth2 process:', err.response ? err.response.data : err.message);
          //  this._setStatus(500, "Failed to fetch user information!!");
            res.status(500).json({ error: 'Failed to fetch user information' });
        }
      }
    }

  logout(instance) {
    if (!(instance instanceof DiscordAuth) ) {
      throw new Error('logout() must be called on an instance of DiscordAuth');
    }

    return function(req, res, next) {
      req.session.destroy();
      res.logout();

      next();
    }.bind(this);
  }


  signup (instance) {
    if (!(instance instanceof DiscordAuth) ) {
      throw new Error('signup() must be called on an instance of DiscordAuth');
    }

    return async function(req,res,next) {
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
