# Loginfy New Feature Branch

Loginfy is a comprehensive authentication module that supports multiple authentication methods and provides robust user management. It is designed to integrate seamlessly with your existing Node.js application, offering features such as local and social OAuth authentication.

## Features

- **Module Export**: Enable easy integration into your Node.js application.

- **Functions and Endpoints**: Create necessary functions and endpoints for authentication.
- **Local Auth Enabler**: Support for Local authentication.
- **Google Auth Enabler**: Support for Google authentication.
- **Discord Auth Enabler**: Support for Discord authentication.
- **Github Auth Enabler**: Support for Github authentication.

## Setup and Usage

### Prerequisites

- Node.js installed
- npm installed
- Npm project initiated with Express Installed
- Express Session Initiated

### Installation

Install Loginfy via npm:

```bash
npm install loginfy
```

### Configuration

```js
const loginfy = require("loginfy");

const middlewareFunction = (req, res, next) => {
    // Your middleware Functionality

    // To get user Details 
    const UserDetails = req.user;
    
    // To get access Token
    const Token = req.tokenResponse;
}

const discordAuthName = 'Discord';

const discordCreds = {
    clientId: "your_discord_client_id",
    clientSecret: "your_discord_client_secret",
    redirectUri: "/discord/callback", // your_callback_url 
    scope: "scope_you_want_to_set"
};

const discordAuth = loginfy.use(discordAuthName);
if (discordAuth) {
    discordAuth.setOptions(discordCreds);
    
    // Endpoints
    app.get("/discord/login", discordAuth.login(discordAuth));
    app.get("/discord/callback", discordAuth.callback(discordAuth), middlewareFunction);
    app.get("/discord/logout", discordAuth.logout(discordAuth));
    app.get("/discord/signup", discordAuth.signup(discordAuth));
} else {
    console.error(`Authentication strategy for ${discordAuthName} not found`);
}

const localAuthName = "LOCAL";
const localAuth = loginfy.use(localAuthName);

console.log(localAuth)

if (localAuth) {
    localAuth.setOptions({
        jwtSecret: "my_secret",
        tokenExpiry: 24, // In Hours
    })

        app.post("/local/login", localAuth.login(localAuth), midd);
        app.post("/local/signup", localAuth.signup(localAuth), midd);
        app.get("/local/logout", localAuth.logout(localAuth));
        // There is no Callback function required in Local Authentication
   
}
else {
    console.error(`Authentication strategy for ${localAuthName} not found`);
}

const githubAuthName = "Github";
const githubAuth = loginfy.use(githubAuthName);

const githubCreds = {
    clientId: "your_github_client_id",
    clientSecret: "your_github_client_secret",
    redirectUri: "/github/callback", // your_callback_url 
    scope: "scope_you_want_to_set"
}

if (githubAuth) {
    githubAuth.setOptions(githubCreds);

    app.get("/github/login", githubAuth.login(githubAuth));
    app.get("/github/callback", githubAuth.callback(githubAuth), middlewareFunction);
    app.get("/github/logout", githubAuth.logout(githubAuth));
    app.get("/github/signup", githubAuth.signup(githubAuth));
} 
else {
    console.error(`Authentication strategy for ${githubAuthName} not found`);
}

const googleAuthName = "Google";
const GoogleAuth = loginfy.use(googleAuthName);

const googleCreds = {
    clientId: "your_google_client_id",
    clientSecret: "your_google_client_secret",
    redirectUri: "/google/callback", // your_callback_url 
    scope: "scope_you_want_to_set"
};

if (GoogleAuth) {
    GoogleAuth.setOptions(googleCreds);

    app.get("/google/login", GoogleAuth.login(GoogleAuth));
    app.get("/google/callback", GoogleAuth.callback(GoogleAuth), middlewareFunction);
    app.get("/google/logout", GoogleAuth.logout(GoogleAuth));
    app.get("/google/signup", GoogleAuth.signup(GoogleAuth));

} else {
    console.error(`Authentication strategy for ${googleAuthName} not found`);
}



```

### Example Usage

```javascript
const express = require("express");
const loginfy = require("./main");
const session = require("express-session")
const app = express();
const mongoose = require("mongoose");

mongoose.connect("MONGO::LINK").then(() => console.log("Connected to database")).catch((err) => console.log(err));

app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    saveUninitialized: true,
    resave: true,
    cookie: { secure: false }
}));

const middlewareFunction = (req, res, next) => {
    console.log(req.user);
    console.log(req.tokenResponse);
}

const discordAuthName = 'Discord';

const discordCreds = {
    clientId: "your_discord_client_id",
    clientSecret: "your_discord_client_secret",
    redirectUri: "/discord/callback", // your_callback_url 
    scope: "scope_you_want_to_set"
};

const discordAuth = loginfy.use(discordAuthName);
if (discordAuth) {
    discordAuth.setOptions(discordCreds);
    
    // Endpoints
    app.get("/discord/login", discordAuth.login(discordAuth));
    app.get("/discord/callback", discordAuth.callback(discordAuth), middlewareFunction);
    app.get("/discord/logout", discordAuth.logout(discordAuth));
    app.get("/discord/signup", discordAuth.signup(discordAuth));
} else {
    console.error(`Authentication strategy for ${discordAuthName} not found`);
}

const localAuthName = "LOCAL";
const localAuth = loginfy.use(localAuthName);

console.log(localAuth)

if (localAuth) {
    localAuth.setOptions({
        jwtSecret: "my_secret",
        tokenExpiry: 24, // In Hours
    })

        app.post("/local/login", localAuth.login(localAuth), midd);
        app.post("/local/signup", localAuth.signup(localAuth), midd);
        app.get("/local/logout", localAuth.logout(localAuth));
        // There is no Callback function required in Local Authentication
   
}
else {
    console.error(`Authentication strategy for ${localAuthName} not found`);
}

const githubAuthName = "Github";
const githubAuth = loginfy.use(githubAuthName);

const githubCreds = {
    clientId: "your_github_client_id",
    clientSecret: "your_github_client_secret",
    redirectUri: "/github/callback", // your_callback_url 
    scope: "scope_you_want_to_set"
}

if (githubAuth) {
    githubAuth.setOptions(githubCreds);

    app.get("/github/login", githubAuth.login(githubAuth));
    app.get("/github/callback", githubAuth.callback(githubAuth), middlewareFunction);
    app.get("/github/logout", githubAuth.logout(githubAuth));
    app.get("/github/signup", githubAuth.signup(githubAuth));
} 
else {
    console.error(`Authentication strategy for ${githubAuthName} not found`);
}

const googleAuthName = "Google";
const GoogleAuth = loginfy.use(googleAuthName);

const googleCreds = {
    clientId: "your_google_client_id",
    clientSecret: "your_google_client_secret",
    redirectUri: "/google/callback", // your_callback_url 
    scope: "scope_you_want_to_set"
};

if (GoogleAuth) {
    GoogleAuth.setOptions(googleCreds);

    app.get("/google/login", GoogleAuth.login(GoogleAuth));
    app.get("/google/callback", GoogleAuth.callback(GoogleAuth), middlewareFunction);
    app.get("/google/logout", GoogleAuth.logout(GoogleAuth));
    app.get("/google/signup", GoogleAuth.signup(GoogleAuth));

} else {
    console.error(`Authentication strategy for ${googleAuthName} not found`);
}

app.listen(4000, () => {
    console.log("Server started on port 4000");
});
```

### SetOptions

There are several options available for setting up your experience

1. Local Authentication:

| Option                   | Type       | Default                           | Usage                                                                                   |
|--------------------------|------------|-----------------------------------|-----------------------------------------------------------------------------------------|
| `usermodel`              | `Array`    | `[]`                              | Stores user model data **OR** Can be left empty package itself will create the model.                                                                 |
| `tokenExpiry`            | `Number`   | `24`                              | Sets the token expiration time in hours.                                                |
| `jwtSecret`                 | `String`   |  | A secret for binding the jwt token.                                                   |

2. Discord Authentication: 

| Option                   | Type       | Default                           | Usage                                                                                   |
|--------------------------|------------|-----------------------------------|-----------------------------------------------------------------------------------------|
| `clientId`              | `String`    |                               | Your discord Client Id for Redirecting to OAuth page                                                                 |
| `clientSecret`            | `Number`   |                              | Your discord Client Secret for Redirecting to OAuth page                                                |
| `redirectUri`                 | `String`   |  | Redirect Url on which user's Info will be forwarded. (It should be same as the Redirect URL on The OAuth Application.)  |
| `scope`                 | `String`   | `identify` `email` | Scope of Your Discord OAuth Application.  |

3. Github Authentication: 

| Option                   | Type       | Default                           | Usage                                                                                   |
|--------------------------|------------|-----------------------------------|-----------------------------------------------------------------------------------------|
| `clientId`              | `String`    |                               | Your github Client Id for Redirecting to OAuth page                                                                 |
| `clientSecret`            | `Number`   |                              | Your github Client Secret for Redirecting to OAuth page                                                |
| `redirectUri`                 | `String`   |  | Redirect Url on which user's Info will be forwarded. (It should be same as the Redirect URL on The OAuth Application.)  |
| `scope`                 | `String`   | `user` | Scope of Your Github OAuth Application.  |

4. Google Authentication: 

| Option                   | Type       | Default                           | Usage                                                                                   |
|--------------------------|------------|-----------------------------------|-----------------------------------------------------------------------------------------|
| `clientId`              | `String`    |                               | Your google Client Id for Redirecting to OAuth page                                                                 |
| `clientSecret`            | `Number`   |                              | Your google Client Secret for Redirecting to OAuth page                                                |
| `redirectUri`                 | `String`   |  | Redirect Url on which user's Info will be forwarded. (It should be same as the Redirect URL on The OAuth Application.)  |
| `scope`                 | `String`   | `profile` `email` | Scope of Your google OAuth Application.  |

<br>

### Note
- If you are passing your own usermodel please ensure you have the following properties in your schema. 
    ```bash
       - email
       - password
       - username // if marked as true in options
       - salt // for storing each user's hash secret.
    ```


### Future Updates
-  Integration of Social OAuth authentications (like X, Microsoft, linkedin, etc.)
-  More Feasible to users with more functionality.
-  Token storage Methods with Secured Endpoints.

<!-- 
## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](CONTRIBUTING.md) guidelines for more information. -->

## Contact

For support or inquiries, please open an issue or contact us at goyalaryan51@gmail.com.

