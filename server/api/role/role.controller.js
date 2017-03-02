'use strict';

var Role = require('../../db/models').Role;


//--------------
// Create role
//--------------
exports.create = function (req, res) {
  // request must not include id
  if (req.body.id) {
    return res.status(400).send('Request body included forbidden parameter: id');
  }

  var _role = Role.sanitize(req.body);

  Role.forge(_role).save()

    .then(function (role) {
      return res.status(201).json(role.toJSON());
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};


//-----------------
// List all roles
//-----------------
exports.index = function (req, res) {
  Role.fetchAll()

  .then(function (roles) {
    return res.json(roles.toJSON());
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};


//----------------------
// Find specified role
//----------------------
exports.find = function (req, res) {
  // This should never happen...
  if (!req.params.role_id) {
    return res.status(400).send('Request missing role id.');
  }

  Role.where({id: req.params.role_id})
    .fetch({require: true, withRelated: ['assignments.album', 'assignments.person']})
    .then(function (role) {
      return res.json(role.toJSON());
    })

    .catch(Role.NotFoundError, function () {
      return res.status(404).end()
    })

    .catch(function (err) {
      console.error('The following bad thing happened:', err);
      return res.status(500).send(err);
    });
};


//------------------------
// Update specified role
//------------------------
exports.update = function (req, res) {
  // This should never happen...
  if (!req.params.role_id) {
    return res.status(400).send('Request missing role id.');
  }

  var _role = Role.sanitize(req.body);

  if (_role.id && _role.id !== req.params.role_id) {
    res.status(400).send('Wrong URL for specified role id.');
  }

  Role.forge({id: req.params.role_id})
    .fetch({require: true})
    .then(function (role) {
      role.save(_role)
        .then(function (role) {
          return res.json(role.toJSON());
        });
    })

    .catch(Role.NotFoundError, function () {
      return res.status(404).end()
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};


//------------------------
// Delete specified role
//------------------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.role_id) {
    return res.status(400).send('Request missing role id.');
  }

  Role.forge({id: req.params.role_id})
    .destroy()
    .then(function () {
      return res.status(204).end();
    })

    .catch(Role.NotFoundError, function () {
      return res.status(404).end()
    })

    .catch(function (err) {
      console.error('The following bad thing happened:', err);
      return res.status(500).send(err);
    });
};
