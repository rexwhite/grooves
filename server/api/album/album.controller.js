'use strict';

var _ = require('lodash');

var Album = require('../../db/models').Album;
var Genre = require('../../db/models').Genre;
var Genres = require('../../db/models').Genres;
var Track = require('../../db/models').Track;


//-----------------------------
// Return array of all albums
//-----------------------------
exports.index = function (req, res) {
  if (req.query.genre_id) {
    Genre.where({id: req.query.genre_id})
    .fetch({withRelated: ['albums']})
    .then(function (genres) {
      return genres.related('albums').fetch({withRelated: ['label', 'artists', 'genres', 'lot']})
      .then(function (albums) {
        return res.json(albums.toJSON({omitPivot: true}));
      });
    })

    .catch(function (err) {
      return res.status(500).send(err);
    });
  }

  else {
    Album.fetchAll({withRelated: ['label', 'artists', 'genres']})
    .then(function (albums) {
      return res.json(albums.toJSON({omitPivot: true}));
    })

    .catch(function (err) {
        return res.status(500).send(err);
    });
  }
};



//-------------------------
// Return specified album
//-------------------------
exports.find = function (req, res) {
  // This should never happen...
  if (!req.params.album_id) {
    return res.status(400).send('Request missing album id.');
  }

  Album.where({id: req.params.album_id})
  .fetch({withRelated: ['label', 'artists', 'genres', 'tracks', 'contributors.person', 'contributors.role', 'lot'], require: true})
  .then(function (album) {
    return res.json(album.toJSON({omitPivot: true}));
  })

  .catch(Album.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    console.log('caught error:', err);
    return res.status(500).send(err);
  });
};



//-------------------------
// Create specified album
//-------------------------
exports.create = function (req, res) {
  // request must not include id
  if (req.body.id) {
    return res.status(400).send('Request body included forbidden parameter: id');
  }

  var album = Album.sanitize(req.body);
  var genres = Genre.sanitize(req.body.genres);

  Album.forge(album).save()
  .then(function (album) {
    return album.genres().attach(Genres.forge(genres).models)
    .then(function () {
      return album;
    });
  })
  .then(function (album) {
    return res.status(201).json(album.toJSON());
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//------------------
// Update an album
//------------------
exports.update = function (req, res) {
  // This should never happen...
  if (!req.params.album_id) {
    return res.status(400).send('Request missing album id.');
  }

  // use the id from the req param instead
  delete req.body.id;
  var _album = Album.sanitize(req.body);
  var _genres = Genre.sanitize(req.body.genres);

  // fetch the album with this id
  Album.forge({id: req.params.album_id}).fetch({require: true})
  .then(function (album) {
    // save updated values (excluding genre and track arrays)
    return album.save(_album)
    .then(function (album) {
      // remove existing genres
      return album.genres().detach()
      .then(function () {
        // add new genres
        return album.genres().attach(Genres.forge(_genres).models)
        .then(function () {
          return album.refresh({withRelated: ['genres']})
          .then(function (album) {
            return res.json(album.toJSON({omitPivot: true}));
          });
        });
      });
    })
    .catch(function (err) {
      console.error('This bad thing happened:', err);
      return res.status(400).send('Malformed Album');
    });
  })

  .catch(Album.NotFoundError, function () {
    return res.status(404).end();
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//-------------------------
// Delete specified album
//-------------------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.album_id) {
    return res.status(400).send('Request missing album id.');
  }

  Album.forge({id: req.params.album_id}).destroy()
  .then(function () {
    // 204 since there is no response body
    return res.status(204).end();
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//---------------------------------
// Add a track to specified album
//---------------------------------
exports.addTrack = function (req, res) {
  // This should never happen...
  if (!req.params.album_id) {
    return res.status(400).send('Request missing album id.');
  }

  var new_track = Track.sanitize(req.body);

  if (new_track.id) {
    return res.status(400).send('Request body included forbidden parameter: id');
  }

  Track.forge(new_track).save({album_id: req.params.album_id})
  .then(function (track) {
    return res.json(track.toJSON());
  })

  .catch(Album.NotFoundError, function () {
    return res.status(404).end();
  })

  .catch(function (err) {
    return res.status(500).json(err);
  });
};



//-------------------------
// Update specified track
//-------------------------
exports.updateTrack = function (req, res) {
  // This should never happen...
  if (!req.params.album_id || !req.params.track_id) {
    return res.status(400).send('Request missing album or track id.');
  }

  var new_track = Track.sanitize(req.body);

  // fetch track for this album
  Track.where({id: req.params.track_id, album_id: req.params.album_id}).fetch({require: true})
  .then(function (track) {
    return track.save(new_track)
    .then(function (track) {
      return res.json(track.toJSON());
    });
  })

  .catch(Track.NotFoundError, function () {
    return res.status(404).end();
  })

  .catch(function (err) {
    return res.status(500).json(err);
  });
};



//--------------------------
// Remove track from album
//--------------------------
exports.removeTrack = function (req, res) {
  // This should never happen...
  if (!req.params.album_id || !req.params.track_id) {
    return res.status(400).send('Request missing album or track id.');
  }

  Track.where({id: req.params.track_id, album_id: req.params.album_id}).destroy()
  .then(function () {
    return res.status(204).end();
  })

  .catch(Track.NotFoundError, function () {
    return res.status(404).end();
  })

  .catch(function (err) {
    return res.status(500).json(err);
  });
};
