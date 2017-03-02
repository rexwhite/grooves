'use strict';

var Artist = require('../../db/models').Artist;


//------------------------------
// return array of all artists
//------------------------------
exports.index = function (req, res) {
  Artist.fetchAll()

  .then(function (artists) {
    return res.json(artists.toJSON());
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};


//------------------------
// find specified artist
//------------------------
exports.find = function (req, res) {
  // This should never happen...
  if (!req.params.artist_id) {
    return res.status(400).send('Request missing artist id.');
  }

  Artist.where({id: req.params.artist_id})

  .fetch({require: true})

  .then(function (artist) {
    return res.json(artist.toJSON());
  })

  .catch(Artist.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    console.log('caught error:', err);
    return res.status(500).send(err);
  });
};


//--------------------------
// create specified artist
//--------------------------
exports.create = function (req, res) {
  // request must not include id
  if (req.body.id) {
    return res.status(400).send('Request body included forbidden parameter: id');
  }

  var artist = Artist.sanitize(req.body);

  Artist.forge(artist)

  .save()

  .then(function (artist) {
    return res.status(201).json(artist.toJSON());
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//--------------------------
// delete specified artist
//--------------------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.artist_id) {
    return res.status(400).send('Request missing artist id.');
  }

  Artist.forge({id: req.params.artist_id})

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
// update specified artist
//--------------------------
exports.update = function (req, res) {
  // This should never happen...
  if (!req.params.artist_id) {
    return res.status(400).send('Request missing artist id.');
  }

  if (req.body.id && req.body.id !== req.params.artist_id) {
    return res.status(400).send('url artist id does not match artist id in request body.');
  }

  var _artist = Artist.sanitize(req.body);

  // fetch the album with this id
  Artist.forge({id: req.params.artist_id}).fetch({require: true})
    .then(function (artist) {
      // save updated values
      return artist.save(_artist)
        .then(function (artist) {
            return res.json(artist.toJSON());
        })
        .catch(function () {
          return res.status(400).send('Malformed Artist');
        });
    })

    .catch(Artist.NotFoundError, function () {
      return res.status(404).end();
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
};



//-------------------------
// Add an artist to album
//-------------------------
exports.addToAlbum = function (req, res) {
  // This should never happen...
  if (!req.params.artist_id || !req.params.album_id) {
    return res.status(500).send('Request missing parameters.');
  }

  // fetch the artist ...
  Artist.where({id: req.params.artist_id}).fetch({require: true})

  .then(function (artist) {
    // add artist to album...
    return (
      artist.albums().attach(req.params.album_id)
        .then(function () {
          return res.status(202).end();
        })

        // handle missing albums
        .catch(Artist.NotFoundError, function (err) {
          return res.status(404).send('Album not found.');
        })
    )
  })

  // handle missing genre
  .catch(Artist.NotFoundError, function () {
    return res.status(404).send('Artist not found.');
  })

  // handle other errors
  .catch(function (err) {
    return res.status(500).send(err);
  });
};


//---------------------------
// Remove artist from album
//---------------------------
exports.removeFromAlbum = function (req, res) {
  // This should never happen...
  if (!req.params.artist_id || !req.params.album_id) {
    return res.status(500).send('Request missing parameters.');
  }

  // fetch the genre...
  Artist.where({id: req.params.artist_id}).fetch({require: true})
    .then(function (artist) {
      // remove album from artist...
      return (
        artist.albums().detach(req.params.album_id)
          .then(function () {
            return res.status(202).end();
          })
      )
    })

    // handle missing genre
    .catch(Artist.NotFoundError, function () {
      return res.status(404).send('Artist not found.');
    })

    // handle other errors
    .catch(function (err) {
      return res.status(500).send(err);
    });
};
