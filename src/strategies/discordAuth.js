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
                    const params = querystring.stringify({
                        client_id: this.options.clientId,
                        redirect_uri: this.options.redirectUri,
                        response_type: 'code',
                        scope: this.options.scope
                    });

                    res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
                }
            }

    async callback(req, res, next) {
                const { code } = req.query;

    try {
      const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', querystring.stringify({
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        code: code,
        redirect_uri: this.options.redirectUri
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });

      const { access_token } = tokenResponse.data;

      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      req.session.access_token = access_token;
      req.session.user = userResponse.data;

      next();

    } catch (error) {
      console.error('Error during OAuth2 process:', error.response ? error.response.data : error.message);
      this._setStatus(300, "Failed to fetch user information!!");
      res.status(500).json({ error: 'Failed to fetch user information' });
    }

     }

     async logout(req, res) {
        req.session.destroy();
        res.redirect('/');
      }


      /**
       * Route Setup
       * app.post('/google/signup', googleAuth.signup.bind(googleAuth), customMiddleware)
       * const customMiddleware = (req, res, next) => {
  const userData = req.session.user;

  // User-defined logic based on `data` parameter
  console.log("Custom middleware received data:", userData);

  // Perform custom actions here (e.g., send email, log analytics, etc.)
  // Example:
  // sendEmail(userData.email, "Welcome to our app!");

  // Send response
  res.status(200).json({ message: 'Signup successful', user: userData });
};
       */

      async signup(req, res, next) {
       
        try {
          const { code } = req.query;
    
          const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
            client_id: this.options.clientId,
            client_secret: this.options.clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: this.options.redirectUri
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
    
          const { access_token } = tokenResponse.data;
    
          const userResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: { Authorization: `Bearer ${access_token}` }
          });
    
          req.session.access_token = access_token;
          req.session.user = userResponse.data;
    
          
          next();
        } catch (error) {
          console.error("Error during signup:", error);
          res.status(500).json({ error: 'Failed to process signup' });
        }
      }

}