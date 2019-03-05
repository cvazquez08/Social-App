require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


const session = require('express-session');

const passportSetup = require('./config/passport/passport-setup');



mongoose
  // .connect('mongodb://localhost/socialapp', {useNewUrlParser: true})
  // upload to heroku DB
  .connect('mongodb://heroku_j26ncn4h:fnqh34nusbh3lqbpcut1ea0ptf@ds237955.mlab.com:37955/heroku_j26ncn4h', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// activate flash in entire app
// activate express session
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

// MUST come after the session
passportSetup(app);

const index = require('./routes/index');
app.use('/', index);

// set up user-routes in app
app.use('/', require('./routes/user-routes'));

// set up auth-routes in app
app.use('/', require('./routes/auth-routes'));

// set up post-routes in app
app.use('/', require('./routes/post-routes'));

// set up comment-routes in app
app.use('/', require('./routes/comment-routes'));





module.exports = app;
