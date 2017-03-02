'use strict';

var Contribution = require('../../db/models').Contribution;


//--------------------------------
// Create specified contribution
//--------------------------------
exports.create = function (req, res) {
  var _contribution = Contribution.sanitize(req.body);
  
  Contribution.forge(_contribution)

  .save()

  .then(function (result) {
    result.refresh({withRelated: ['person', 'role', 'album']})
      .then(function (contribution) {
        return res.json(contribution.toJSON());
      })
  })

  .catch(function (err) {
    console.error('The following bad thing happened:', err);
    return res.status(500).send(err);
  });
};


//--------------------------------
// Delete specified contribution
//--------------------------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.contrib_id) {
    return res.status(400).send('Request missing contribution id.');
  }

  Contribution.forge({id: req.params.contrib_id})

  .destroy()

  .then(function () {
    return res.status(204).end();
  })

  .catch(Contribution.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    console.error('The following bad thing happened:', err);
    return res.status(500).send(err);
  });
};


