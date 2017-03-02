'use strict';

var User = require('../../db/models').User;



// Return details about logged in user
exports.me = function (req, res) {
  return res.json(req.user);
};


// Finds the given user, returns a User object or null
exports.find = function (username) {

  return User.where('username', username)

    .fetch({withRelated: ['permissions']})

    .then(function (result) {
      if (!result)
        return null;

      var user = result.toJSON({shallow: true});
      user.permissions = result.related('permissions').pluck('permission');

      return user;
    });

};
