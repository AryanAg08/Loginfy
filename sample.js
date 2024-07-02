const express = require("express");
const loginfy = require("./main");
const session = require("express-session")
const app = express();

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
    res.json({message: "you are logged in!!"})
}

const discordAuth = loginfy.use(discordAuthName);
if (discordAuth) {
    discordAuth.setOptions(discordCreds);

    app.get("/discord/login", discordAuth.login(discordAuth));
    app.get("/discord/callback", discordAuth.callback(discordAuth), midd);
    app.get("/discord/logout", discordAuth.logout(discordAuth));
} else {
    console.error(`Authentication strategy for ${googleAuthName} not found`);
}

app.listen(4000, () => {
    console.log("Server started on port 4000");
});