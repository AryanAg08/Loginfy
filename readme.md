# Loginfy

Loginfy is a comprehensive authentication module that supports multiple authentication methods and provides robust user management. It is designed to integrate seamlessly with your existing Node.js application, offering features such as module export, cookie management, and social media authentication.

## Features

- **Module Export**: Enable easy integration into your Node.js application.

- **Functions and Endpoints**: Create necessary functions and endpoints for authentication.
<!-- - **Cookie Checker**: Validate cookies and ensure proper request handling.
- **Google Auth Enabler**: Support for Google authentication.
- **Discord Auth Enabler**: Support for Discord authentication.
- **Twitter Auth Enabler**: Support for Twitter authentication. -->

## Setup and Usage

### Prerequisites

- Node.js installed
- npm installed
- Npm project initiated with Express Installed

### Installation

Install Loginfy via npm:

```bash
npm install loginfy
```

### Configuration

1. **Module Export**: Import and use Loginfy in your application.

    ```javascript
    const loginfy = require('loginfy');
    ```
2. **Options**: Basic Options to set for simplifying things. 

```javascript
      loginfy.setOptions(
    {
        loginOptions: {
            Email: true,
            Password: true,
            Username: true,
        },
        samesite: true,
        usermodel: require("./userModel"),
    }
);

    loginfy.use();
```

3. **Endpoints**: Define the required endpoints for login, signup, and logout.

    ```javascript
    app.post('/signup', loginfy.signup);
    app.post('/login', loginfy.login);
    app.post('/logout', loginfy.logout);
    ```
<!-- ### Functions

- **createHashPassword**: Create a hashed password.

    ```javascript
    const hashedPassword = loginfy.createHashPassword(password);
    ```

- **compareHashPassword**: Compare a password with a hashed password.

    ```javascript
    const isMatch = loginfy.compareHashPassword(password, hashedPassword);
    ``` -->

### Example Usage

```javascript
const express = require('express');
const cookieParser = require('cookie-parser'); // alternative cookie library can also be used for setting up cookie secret.
const loginfy = require('loginfy');

const app = express();
app.use(express.json());
app.use (cookieParser("loginfy-example"));

// Setup Loginfy
 loginfy.setOptions(
    {
        loginOptions: {
            Email: true,
            Password: true,
            Username: true,
        },
        samesite: true,
        usermodel: require("./userModel"), // can be left empty. The package itself can create the usermodel!!
    }
);
loginfy.use();

// Setup Loginfy enpoints
app.post('/signup', loginfy.signup);
app.post('/login', loginfy.login);
app.post('/logout', loginfy.logout);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

### SetOptions

There are several options available for pre-setting your experience

| Option                   | Type       | Default                           | Usage                                                                                   |
|--------------------------|------------|-----------------------------------|-----------------------------------------------------------------------------------------|
| `samesite`               | `Boolean`  | `false`                           | Indicates if the SameSite attribute should be set for cookies.                          |
| `loginOptions.Email`     | `Boolean`  | `true`                            | Determines if email login is enabled.                                                   |
| `loginOptions.Password`  | `Boolean`  | `true`                            | Determines if password login is enabled.                                                |
| `loginOptions.UserName`  | `Boolean`  | `false`                           | Determines if username login is enabled.                                                |
| `usermodel`              | `Array`    | `[]`                              | Stores user model data **OR** Can be left empty package itself will create the model.                                                                 |
| `tokenExpiry`            | `Number`   | `24`                              | Sets the token expiration time in hours.                                                |
| `cookieSigned`           | `Boolean`  | `true`                            | Indicates if the cookies should be signed.                                              |
| `cokkieMaxAge`           | `Number`   | `1000 * 60 * 60 * 24` (`86400000`) | Sets the maximum age for cookies in milliseconds (default is one day).                  |
| `secret`                 | `String`   | `loginfy` | A secret for binding the jwt token.                                                   |

### Note
- If you are passing your own usermodel please ensure you have the following properties in your schema. 
    ```js
       - email
       - password
       - username // if marked as true in options
       - salt // for storing each user's hash secret.
    ```


### Future Updates
-  Integration of Social media authentications (like google, github, linkedin, etc.)
<!-- 
## Development Progress

### 05-05-2024

✅ Done with setting login options, fetching user models, and checking for email, username, and password.  
✅ Checking them when initiating the use function.

### 06-05-2024

✅ Global Model Creation Done.  
✅ Added feature to create a model if it doesn't exist.  

✅ Start Working on Login Feature.  

✅ Create Hash Password.  
✅ Compare Sync Matching Hash to hash. -->

<!-- ## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. -->
<!-- 
## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](CONTRIBUTING.md) guidelines for more information. -->

## Contact

For support or inquiries, please open an issue or contact us at goyalaryan51@gmail.com.




<!-- 
## Things to be done: 

// If user is using cookie, then make sure he is using the cookie parser with its secret. 
// change the readme and make another readme for tracking internal changes!! Secret one!!
// Alos put a check on the login, signup side for the req.body if we are getting same things only and also they are not empty.
```js
const express = require('express');
const AuthHelper = require('auth-helper');

const app = express();
app.use(express.json());

const authHelper = new AuthHelper();

// Set the strategy
authHelper.setStrategy('google');

// Initialize with options
authHelper.initialize({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',  
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    redirectURI: 'YOUR_REDIRECT_URI'
});

app.post('/signin', async (req, res) => {
    const { token } = req.body;
    try {
        const payload = await authHelper.signIn(token);
        res.json(payload);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

```

there is no requirement of using express router just pick the originalurl and break it in accordance with / and pick the second argument accodingly. -->