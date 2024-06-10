const AuthProviders = require("./AuthName");
const GithubAuth = require("./strategies/githubAuth");
const GoogleAuth = require("./strategies/googleAuth");
const LocalAuth = require("./strategies/localAuth");
const DiscordAuth = require("./strategies/discordAuth");

const getAuthType = (authName) => {
    console.log(authName);
    try {
        const auth = AuthProviders[authName.toUpperCase()];
        console.log(auth);
        switch (auth) {
            case AuthProviders.GOOGLE:
                return new GoogleAuth();
            case AuthProviders.GITHUB:
                return new GithubAuth();
            case AuthProviders.LOCAL:
                return new LocalAuth();
            case AuthProviders.DISCORD:
                return new DiscordAuth();
            default:
                return null;
        }
    } catch (error) {
        throw new error(`Auth name: ${authName} not found`);
    }
};

const use = (authName) => {
    return getAuthType(authName);
};

module.exports = { use };