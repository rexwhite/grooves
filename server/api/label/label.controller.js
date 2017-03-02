'use strict';

var Label = require('../../db/models').Label;


//-----------------------------
// return array of all labels
//-----------------------------
exports.index = function (req, res) {
  Label.fetchAll()

    .then(function (labels) {
      return res.json(labels.toJSON());
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};


//-----------------------
// find specified label
//-----------------------
exports.find = function (req, res) {
  // This should never happen...
  if (!req.params.label_id) {
    return res.status(400).send('Request missing label id.');
  }

  Label.where({id: req.params.label_id})

    .fetch({require: true})

    .then(function (label) {
      return res.json(label.toJSON());
    })

    .catch(Label.NotFoundError, function () {
      return res.status(404).end()
    })

    .catch(function (err) {
      console.log('caught error:', err);
      return res.status(500).send(err);
    });
};


//-------------------------
// create specified label
//-------------------------
exports.create = function (req, res) {
  // request must not include id
  if (req.body.id) {
    return res.status(400).send('Request body included forbidden parameter: id');
  }

  var label = Label.sanitize(req.body);

  Label.forge(label)

    .save()

    .then(function (label) {
      return res.status(201).json(label.toJSON());
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};



//-------------------------
// delete specified label
//-------------------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.label_id) {
    return res.status(400).send('Request missing label id.');
  }

  Label.forge({id: req.params.label_id})

    .destroy()

    .then(function () {
      // 204 since there is no response body
      return res.status(204).end();
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};



//--------------------------
// update specified label
//--------------------------
exports.update = function (req, res) {
  // This should never happen...
  if (!req.params.label_id) {
    return res.status(400).send('Request missing label id.');
  }

  if (req.body.id && req.body.id !== req.params.label_id) {
    return res.status(400).send('url label id does not match label id in request body.');
  }

  var _label = Label.sanitize(req.body);

  // fetch the label with this id
  Label.forge({id: req.params.label_id}).fetch({require: true})

  .then(function (label) {
    // save updated values
    return label.save(_label)
      .then(function (label) {
        return res.json(label.toJSON());
      })
      .catch(function () {
        return res.status(400).send('Malformed Label');
      });
  })

  .catch(Label.NotFoundError, function () {
    return res.status(404).end();
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};
