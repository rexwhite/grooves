'use strict';

var Lot = require('../../db/models').Lot;


//---------------------------
// return array of all lots
//---------------------------
exports.list = function (req, res) {
  Lot.fetchAll()

    .then(function (lots) {
      return res.json(lots.toJSON());
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};


//---------------------
// find specified lot
//---------------------
exports.fetch = function (req, res) {
  // This should never happen...
  if (!req.params.lot_id) {
    return res.status(400).send('Request missing lot id.');
  }

  Lot.where({id: req.params.lot_id})

    .fetch({require: true})

    .then(function (lot) {
      return res.json(lot.toJSON());
    })

    .catch(Lot.NotFoundError, function () {
      return res.status(404).end()
    })

    .catch(function (err) {
      console.log('caught error:', err);
      return res.status(500).send(err);
    });
};


//-----------------------
// create specified lot
//-----------------------
exports.create = function (req, res) {
  // request must not include id
  if (req.body.id) {
    return res.status(400).send('Request body included forbidden parameter: id');
  }

  var lot = Lot.sanitize(req.body);

  Lot.forge(lot)

    .save()

    .then(function (lot) {
      return res.status(201).json(lot.toJSON());
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};



//-----------------------
// delete specified lot
//-----------------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.lot_id) {
    return res.status(400).send('Request missing lot id.');
  }

  Lot.forge({id: req.params.lot_id})

    .destroy()

    .then(function () {
      // 204 since there is no response body
      return res.status(204).end();
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};



//------------------------
// update specified lot
//------------------------
exports.update = function (req, res) {
  // This should never happen...
  if (!req.params.lot_id) {
    return res.status(400).send('Request missing lot id.');
  }

  if (req.body.id && req.body.id !== req.params.lot_id) {
    return res.status(400).send('url lot id does not match lot id in request body.');
  }

  var _lot = Lot.sanitize(req.body);

  // fetch the lot with this id
  Lot.forge({id: req.params.lot_id}).fetch({require: true})

    .then(function (lot) {
      // save updated values
      return lot.save(_lot)
        .then(function (lot) {
          return res.json(lot.toJSON());
        })
        .catch(function () {
          return res.status(400).send('Malformed Lot');
        });
    })

    .catch(Lot.NotFoundError, function () {
      return res.status(404).end();
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};
