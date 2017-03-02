'use strict';

var Person = require('../../db/models').Person;
var Contribution = require('../../db/models').Contribution;


//----------------
// Create person
//----------------
exports.create = function (req, res) {
  // request must not include id
  if (req.body.id) {
    return res.status(400).send('Request body included forbidden parameter: id');
  }

  var person = Person.sanitize(req.body);

  Person.forge(person).save()

  .then(function (person) {
    return res.status(201).json(person.toJSON());
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};


//------------------
// List all people
//------------------
exports.index = function (req, res) {
  Person.fetchAll()

  .then(function (people) {
    return res.json(people.toJSON());
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};


//------------------------
// Find specified person
//------------------------
exports.find = function (req, res) {
  // This should never happen...
  if (!req.params.person_id) {
    return res.status(400).send('Request missing person id.');
  }

  Person.where({id: req.params.person_id})
  .fetch({require: true, withRelated: ['contributions.album', 'contributions.role']})
  .then(function (person) {
    return res.json(person.toJSON());
  })

  .catch(Person.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};


//--------------------------
// Update specified person
//--------------------------
exports.update = function (req, res) {
  // This should never happen...
  if (!req.params.person_id) {
    return res.status(400).send('Request missing person id.');
  }

  var _person = Person.sanitize(req.body);

  if (_person.id && _person.id !== req.params.person_id) {
    res.status(400).send('Wrong URL for specified person id.');
  }

  Person.forge({id: req.params.person_id})
  .fetch({require: true})
  .then(function (person) {
    person.save(_person)
    .then(function (person) {
      return res.json(person.toJSON());
    });
  })

  .catch(Person.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};


//--------------------------
// Delete specified person
//--------------------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.person_id) {
    return res.status(400).send('Request missing person id.');
  }

  Person.forge({id: req.params.person_id})
  .destroy()
  .then(function () {
    return res.status(204).end();
  })

  .catch(Person.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    console.error('The following bad thing happened:', err);
    return res.status(500).send(err);
  });
};
