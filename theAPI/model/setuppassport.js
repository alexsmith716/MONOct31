var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./userSchema.js');

module.exports = function() {
  
  passport.serializeUser(function(user, done) {
    //console.log('####### > setuppassport.js > passport.serializeUser: ', user.id)
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    //console.log('####### > setuppassport.js > passport.deserializeUser')
    User.findById(id, function(err, user) {
      if(user){
        //console.log('####### > setuppassport.js > passport.deserializeUser > USER: ', user)
        //console.log('####### > setuppassport.js > passport.deserializeUser > req.user: ', req.user)
      }
      done(err, user);
    });
  });

  passport.use('local', new LocalStrategy({ usernameField: 'email' }, function(username, password, done) {
      //console.log('####### > setuppassport.js > passport.use')

      User.findOne({ email: username }, function(err, user) {
        //console.log('####### > setuppassport.js > passport.use > User.findOne')
        if (err) { 
          //console.log('####### > setuppassport.js > passport.use > User.findOne > ERROR')
          return done(err); 
        }
        if (!user) {
          //console.log('####### > setuppassport.js > passport.use > User.findOne > !user')
          return done(null, false, { message: 'No user has that username!' });
        }

        if (!user.checkPassword(password)) {
          return done(null, false, { message: 'Invalid password.' });
        }
        return done(null, user);
      });
    }
  ));

};
