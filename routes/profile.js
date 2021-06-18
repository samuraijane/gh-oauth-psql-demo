const express = require('express');
const { User } = require('../models');

const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { response } = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect(`/profile/${req.session.passport.user}`);
});

router.get("/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  if(!id) {
      res.status(404).send("profile id is missing")
  } else {
    const userData = await User.findOne({
      where: {
        loginStrategyId: id
      }
    });
    if(!userData) {
      res.send('user data not found in the database')
    } else {
      res.render('profile', {
        locals: {
          isAuthenticated: req.isAuthenticated(),
          userData
        },
        partials: {
          footer: 'partials/footer',
          head: 'partials/head',
          header: 'partials/header'
        }
      })
    }
  }
})

module.exports = router;