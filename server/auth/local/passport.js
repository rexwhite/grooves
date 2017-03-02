'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local');
var bcrypt = require('bcryptjs');

var User = require('../../api/user/user.controller');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find(username).
    then(function (record) {
      // did the user even exist?
      if (!record) throw 'User [' + username + '] does not exist.';

      // create a sanitized object to return to user
      var user = {
        username: record.username,
        password: null,
        name: record.name,
        permissions: record.permissions,
        loggedIn: true  // this is just a convenience item for the client UI
      };

      bcrypt.compare(password, record.password, function (err, match) {
        if (match) done(null, user);
        else {
          console.log('Auth: User [' + username + '] authentication error.');
          done(null, null);
        }
      });
    }).
    catch(function (err) {
      console.log("Auth:", err);
      // TODO: log auth failures?
      done(null, null);
    });
  }
));
