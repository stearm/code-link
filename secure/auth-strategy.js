const Bcrypt = require('bcrypt');
const Basic = require('hapi-auth-basic');
const db = require('../db');

const validate = function(request, username, password, callback) {
  db.utente.findOne({
    username: username
  }, (err,user) => {
    if(err || !user) return callback(null, false);
    Bcrypt.compare(password, user.password, (err, isValid) => {
      callback(err, isValid, { id: user.id, password: user.password });
    });
  });
};

module.exports = function(server){
  server.register(Basic, (err) => {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });
    // it makes all routes need authentication by default
    server.auth.default({
      strategy: 'simple'
    });
  });
};
