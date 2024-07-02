const { AuthProviders } = require("./AuthName");
const GithubAuth = require("./strategies/githubAuth");
const GoogleAuth = require("./strategies/googleAuth");
const LocalAuth = require("./strategies/localAuth");
const DiscordAuth = require("./strategies/discordAuth");


const getAuthType = (authName) => {
    console.log(authName);
    const auth = AuthProviders[authName.toUpperCase()];
    console.log(`Converted authName to uppercase: ${authName.toUpperCase()}`); // Log the converted authName
    console.log(`Matched auth provider: ${auth}`); // Log the matched auth provider

    if (!auth) {
        throw new Error(`Auth name: ${authName} not found`);
    }

    switch (auth) {
        case AuthProviders.GOOGLE:
            return new GoogleAuth();
        case AuthProviders.GITHUB:
            return new GithubAuth();
        case AuthProviders.LOCAL:
            return new LocalAuth();
        case AuthProviders.DISCORD:
           {
            console.log("this module is called!!");
            return new DiscordAuth();
           }

        default:
            throw new Error(`Auth provider ${authName} not supported`);
    }
};

const use = (authName) => {
    return getAuthType(authName);
};

module.exports = { use };