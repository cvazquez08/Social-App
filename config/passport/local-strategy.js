const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');

const User = require('../../models/user-model.js');

passport.use(new LocalStrategy({
  usernameField: 'email' 
  // need to do this step, since our app is using email instead of username
  // if our app has username, we do not need the object {usernameField: 'email'}
},(email, password, next) => {
  User.findOne({ email })
  .then(userFromDb => {
    if(!userFromDb){
      return next(null, false, { message: 'Incorrect Email or Password'})
    }
    if(userFromDb.password){
      if(!bcrypt.compareSync(password, userFromDb.password)){
        return next(null, false, { message: 'Incorrect Email or Password'})
      }
    }else {
      // return next(null, false, { message: 'Please use social login'})
    }
    
    return next(null, userFromDb)
  })
  .catch(error => next(error));
}))