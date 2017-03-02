'use strict';

var Genre = require('../../db/models').Genre;
var Album = require('../../db/models').Album;



//-----------------------------
// Return array of all genres
//-----------------------------
exports.index = function (req, res) {
  Genre.fetchAll().then(function (genres) {
    return res.json(genres.toJSON());
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//------------------------
// Return specific genre
//------------------------
exports.find = function (req, res) {
  // This should never happen...
  if (!req.params.genre_id) {
    return res.status(500).send('Request missing genre id.');
  }

  Genre.where({id: req.params.genre_id})
  .fetch({require: true})
  .then(function (genre) {
    return res.json(genre.toJSON());
  })

  .catch(Genre.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//-----------------
// create a genre
//-----------------
exports.create = function (req, res) {
  delete req.body.id;
  delete req.body.sparky;
  Genre.forge(req.body).save()
  .then(function (genre) {
    return res.json(genre.toJSON());
  }).

  catch(function (err) {
    return res.status(500).send(err);
  });
};



//-----------------
// Update a genre
//-----------------
exports.update = function (req, res) {
  // This should never happen...
  if (!req.params.genre_id) {
    return res.status(500).send('Request missing genre id.');
  }

  Genre.where({id: req.params.genre_id})
  .fetch({require: true})
  .save({name: req.body.name})
  .then(function (genre) {
    return res.json(genre.toJSON());
  })

  .catch(Genre.NotFoundError, function () {
    return res.status(404).end()
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//-----------------
// Delete a genre
//-----------------
exports.delete = function (req, res) {
  // This should never happen...
  if (!req.params.genre_id) {
    return res.status(500).send('Request missing genre id.');
  }

  Genre.forge({id: req.params.genre_id}).destroy()
  .then(function () {
    return res.status(204).end();
  })

  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//---------------------
// Add album to genre
//---------------------
exports.addAlbum = function (req, res) {
  // This should never happen...
  if (!req.params.genre_id || !req.params.album_id) {
    return res.status(500).send('Request missing parameters.');
  }

  // fetch the genre...
  Genre.where({id: req.params.genre_id}).fetch({require: true})
  .then(function (genre) {
    // add album to genre...
    return (
      genre.albums().attach(req.params.album_id)
      .then(function (genre) {
        return res.status(202).end();
      })

      // handle missing albums
      .catch(Album.NotFoundError, function (err) {
        return res.status(404).send('Album not found.');
      })
    )
  })

  // handle missing genre
  .catch(Genre.NotFoundError, function () {
    return res.status(404).send('Genre not found.');
  })

  // handle other errors
  .catch(function (err) {
    return res.status(500).send(err);
  });
};



//--------------------------
// Remove album from genre
//--------------------------
exports.removeAlbum = function (req, res) {
  // This should never happen...
  if (!req.params.genre_id || !req.params.album_id) {
    return res.status(500).send('Request missing parameters.');
  }

  // fetch the genre...
  Genre.where({id: req.params.genre_id}).fetch({require: true})
    .then(function (genre) {
      // remove album from genre...
      return (
        genre.albums().detach(req.params.album_id)
        .then(function (genre) {
          return res.status(202).end();
        })
      )
    })

    // handle missing genre
    .catch(Genre.NotFoundError, function () {
      return res.status(404).send('Genre not found.');
    })

    // handle other errors
    .catch(function (err) {
      return res.status(500).send(err);
    });
};
