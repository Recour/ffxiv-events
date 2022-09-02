import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import * as dotenv from 'dotenv';
import { prisma } from '../prisma';

dotenv.config();

const googleCallbackURL = process.env.NODE_ENV === "production" ? "https://www.ffxiv-events.com/auth/google/redirect" : "http://localhost:4000/auth/google/redirect"

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID ?? '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  callbackURL: googleCallbackURL,
  passReqToCallback: true,
  scope: ['email', 'profile']
},
  async (request: any, accessToken: string, refreshToken: string, profile: any, done: (error: any, user: any) => void) => {
    const displayName = profile.displayName;
    const email = profile.email;
    const photoUrl = profile.picture;

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
        done(null, upsertUser);
      }
    }
  }
));
