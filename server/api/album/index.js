'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./album.controller');

router.post('/', secure, controller.create);
router.get('/', controller.index);
router.get('/:album_id', controller.find);
router.post('/:album_id', secure, controller.update);
router.delete('/:album_id', secure, controller.delete);

router.post('/:album_id/tracks', secure, controller.addTrack);
router.post('/:album_id/tracks/:track_id', controller.updateTrack);
router.delete('/:album_id/tracks/:track_id', controller.removeTrack);

module.exports = router;

// √ Create:    POST    /albums {new album}
// √ Retrieve:  GET     /albums
// √ Retrieve:  GET     /albums?genre=3
// √ Retrieve:  GET     /albums/:album_id
// √ Update:    POST    /albums/:album_id {new values}
// √ Delete:    DELETE  /albums/:album_id

// Retrieve:  GET     /albums/:album_id/genres
// Update:    POST    /albums/:album_id/genres/:genre_id
// Delete:    DELETE  /albums/:album_id/genres/:genre_id

// Retrieve:  GET     /albums/:album_id/tracks
// √ Create:    POST    /albums/:album_id/tracks {new track}
// √ Update:    POST    /albums/:album_id/tracks/:track_id {new values}
// √ Delete:    DELETE  /albums/:album_id/tracks/:track_id
