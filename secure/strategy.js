var LocalStrategy = require('passport-local').Strategy;
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/codlicious', ['utente']);

passport.use('local-login', new LocalStrategy(
  function(username,password,done){
    db.utente.findOne({
      username: username
    }, function(err, user){
      if (err){ return done(err); }
      if (!user){ return done(null, false); }
      if(!user.password != password){ return done(null,false) }
      return done(null,user);
    });
  }
));
