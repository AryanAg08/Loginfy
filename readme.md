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

2. **Endpoints**: Define the required endpoints for login, signup, and logout.

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

### Example

```javascript
const express = require('express');
const loginfy = require('loginfy');

const app = express();
app.use(express.json());

// Setup Loginfy
app.post('/signup', loginfy.signup);
app.post('/login', loginfy.login);
app.post('/logout', loginfy.logout);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## Development Progress

### 05-05-2024

✅ Done with setting login options, fetching user models, and checking for email, username, and password.  
✅ Checking them when initiating the use function.

### 06-05-2024

✅ Global Model Creation Done.  
✅ Added feature to create a model if it doesn't exist.  

✅ Start Working on Login Feature.  

✅ Create Hash Password.  
✅ Compare Sync Matching Hash to hash.

<!-- ## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. -->
<!-- 
## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](CONTRIBUTING.md) guidelines for more information. -->

## Contact

For support or inquiries, please open an issue or contact us at goyalaryan51@gmail.com.