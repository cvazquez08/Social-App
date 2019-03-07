const express = require('express');
const router  = express.Router();

const passport = require('passport');

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

const User = require('../models/user-model');

// require cloudinary
const uploadCloudinary = require('../config/cloudinary.js');

// render signup hbs file
router.get('/signup', (req,res,next) => {
  res.render('auth/signup', {layout: false});
})

// form action="/signup" 
router.post('/signup', uploadCloudinary.single('defaultImg'), (req,res,next) => {

  const userEmail = req.body.email;
  const password = req.body.password;
  const userFullName = req.body.fullName;
  const userName = req.body.username;
  const defaultImg = req.file.secure_url;

  // during signup check if Username OR Email are already taken
  // if so flash error message and redirect to login
  User.findOne({$or: [
    {email: userEmail},
    {username: userName}
  ]})
  .then(foundUser => {
    if(foundUser !==null){
      req.flash('error', 'Sorry that Email or Username already exists')
      res.redirect('/login');

      return;
    }

  // bcrypt password
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPassword = bcrypt.hashSync(password, salt);

  // create user based on form
  User.create({
    email: userEmail,
    password: hashPassword,
    fullName: userFullName,
    username: userName,
    defaultImg: defaultImg
  })

  .then( user => {

    res.redirect('login');
  })
  .catch( error => next(error))
})
  .catch(error =>  next(error))
})

// render login hbs file
router.get('/login', (req,res,next) => {
  res.render('auth/login', {layout: false});
})

// login POST route - authentaction to local-strategy
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));


// // ** LOGOUT **
router.get('/logout', (req,res,next) => {
  // logOut() passport method which destorys session
  req.logOut(); 
  res.redirect('/login')
})


module.exports = router;
