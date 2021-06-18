require('dotenv').config();
const es6Renderer = require('express-es6-template-engine');
const express = require("express");
const passport = require('passport');
const session = require('express-session');

const { PORT } = process.env;


// application instance
const app = express();


// session config for express-session
const sessionConfig = {
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true,
  secret: 'keyboard cat'
};


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(__dirname + '/public'));

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session())


// template rendering
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');


app.get('/', (req, res) => {
  res.render('landing', {
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

// routes
const { auth, profile } = require('./routes');
app.use('/auth', auth);
app.use('/profile', profile);


app.listen(PORT, () => {
  console.log(`The server is running at port ${PORT}`);
})