import passport from 'passport';
import { Strategy as DiscordStrategy, Scope, Profile, VerifyCallback } from '@oauth-everything/passport-discord';
import * as dotenv from 'dotenv';
import { prisma } from '../prisma';

dotenv.config();

const discordCallbackURL = process.env.NODE_ENV === "production" ? "https://www.ffxiv-events.com/auth/discord/redirect" : "http://localhost:4000/auth/discord/redirect"

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID ?? '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
  callbackURL: discordCallbackURL,
  scope: [Scope.EMAIL, Scope.IDENTIFY]
},
  async (accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback<any>) => {
    const displayName = profile.displayName;
    const email = profile?.emails?.[0].value ?? null;
    const photoUrl = profile?.photos?.[0].value ?? null;

    if (displayName && email && photoUrl) {
      const upsertUser = await prisma.user.upsert({
        where: {
          email
        },
        update: {
          displayName,
          photoUrl
        },
        create: {
          email,
          displayName,
          photoUrl
        },
      })

      if (upsertUser) {
        cb(null, upsertUser);
      }
    }
  }
));
