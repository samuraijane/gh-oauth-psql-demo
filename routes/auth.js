const express = require('express');
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const { User } = require('../models');

const router = express.Router();

passport.use(new GitHubStrategy({
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
},
async function(accessToken, refreshToken, profile, cb) {
  let user = await User.findOrCreate({
    where: {
      avatarURL:        profile.photos[0].value,
      loginStrategy:    profile.provider,
      loginStrategyId:  profile.id,
      username:         profile.username
    }
  });

  cb(null, profile)
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});


router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect(`/profile/${req.session.passport.user}`);
  }
);

router.get('/login', (req, res) => {
  res.render('login', {
    locals: {
      isAuthenticated: req.isAuthenticated()
    },
    partials: {
      footer: 'partials/footer',
      head: 'partials/head',
      header: 'partials/header'
    }
  })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/")
});

module.exports = router;