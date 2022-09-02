import isDev from "../helpers/isDev";

const DISCORD_AUTH_LINKS = {
  DEVELOPMENT:
    "https://discord.com/api/oauth2/authorize?client_id=914937831284179026&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20email",
  PRODUCTION:
    "https://discord.com/api/oauth2/authorize?client_id=914937831284179026&redirect_uri=https%3A%2F%2Fffxiv-events-5d287.web.app%2Flogin&response_type=code&scope=identify%20email",
};

const DISCORD_REDIRECT_URLS = {
  DEVELOPMENT: "http://localhost:3000/login",
  PRODUCTION: "https://ffxiv-events-5d287.web.app/login",
};

export const DISCORD_AUTH_LINK = isDev
  ? DISCORD_AUTH_LINKS.DEVELOPMENT
  : DISCORD_AUTH_LINKS.PRODUCTION;

export const DISCORD_REDIRECT_URL = isDev
  ? DISCORD_REDIRECT_URLS.DEVELOPMENT
  : DISCORD_REDIRECT_URLS.PRODUCTION;
