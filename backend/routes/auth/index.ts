import express from 'express';
import passport from 'passport';

const router = express.Router();

const redirect = process.env.NODE_ENV === 'production' ? '/events' : 'http://localhost:3000/events';

// Log out
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect(redirect);
  });
});

// Google
router.get('/google/redirect', passport.authenticate('google', {
  failureRedirect: redirect,
  successRedirect: redirect
}));

router.get('/google', passport.authenticate('google'));

// Discord
router.get('/discord/redirect', passport.authenticate('discord', {
  failureRedirect: redirect,
  successRedirect: redirect
}));

router.get('/discord', passport.authenticate('discord'));

export default router;