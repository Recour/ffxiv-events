import express, { ErrorRequestHandler, Express } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import authRouter from './routes/auth';
import apiRouter from './routes/api';
import connectPgSimple from 'connect-pg-simple';
import './passport/discordStrategy';
import './passport/googleStrategy';
import * as dotenv from 'dotenv';
import compression from 'compression';
import { findUser } from './prisma';

dotenv.config();

const app: Express = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Passport
app.use(session({
  secret: process.env.SECRET ?? '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000 * 60 * 24 // 1 day
  },
  store: new (connectPgSimple(session))({
    conObject: {
      connectionString: process.env.POSTGRES_DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    createTableIfMissing: true
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  const pgUser = user as any;

  done(null, pgUser.id);
});

passport.deserializeUser(async (userId: number, done) => {
  try {
    const user = await findUser(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Compression
app.use(compression());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api', apiRouter);

// AFTER defining routes: Anything that doesn't match what's above, send back index.html; (the beginning slash ('/') in the string is important!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../frontend/build/index.html'));
})

// Error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
};

app.use(errorHandler);

// Choose the port and start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`)
})

module.exports = app;
