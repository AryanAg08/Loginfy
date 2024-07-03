const express = require("express");
const loginfy = require("./main");
const session = require("express-session")
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://elmo-Robot:8104085546Ag@cluster0.y7884.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => console.log("Connected to database")).catch((err) => console.log(err));

app.use(express.json());


app.use(session({
    secret: 'your-secret-key',
    saveUninitialized: true,
    resave: true,
    cookie: { secure: false }
}));

const discordAuthName = 'Discord';

const discordCreds = {
    clientId: "1252273278723031130",
    clientSecret: "0nR0aW-LhU2Mo2y52kj5KP3Q_ceiG_Ic",
    redirectUri: "/discord/callback",
};

const midd = (req, res, next) => {
    console.log(req.user);
    console.log(req.tokenResponse);
    res.json({message: "you are logged in!!"})
}

const discordAuth = loginfy.use(discordAuthName);
if (discordAuth) {
    discordAuth.setOptions(discordCreds);

    app.get("/discord/login", discordAuth.login(discordAuth));
    app.get("/discord/callback", discordAuth.callback(discordAuth), midd);
    app.get("/discord/logout", discordAuth.logout(discordAuth));
    // Change the Signup function It should first fetch user and using that code which is genereated user data should be fetched and user token along with both the data should be returned as per the usual pattern.
} else {
    console.error(`Authentication strategy for ${discordAuthName} not found`);
}

const localAuthName = "LOCAL";
const localAuth = loginfy.use(localAuthName);

console.log(localAuth)

if (localAuth) {
    localAuth.setOptions({
        jwtSecret: "mysecret",
        tokenExpiry: 24,
    })

        console.log("options set")
        app.post("/local/login", localAuth.login(localAuth), midd);
        app.post("/local/signup", localAuth.signup(localAuth), midd);
        app.get("/local/logout", localAuth.logout(localAuth));

   
}
else {
    console.error(`Authentication strategy for ${localAuthName} not found`);
}

app.listen(4000, () => {
    console.log("Server started on port 4000");
});