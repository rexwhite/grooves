'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./genre.controller');

router.post('/', secure, controller.create);
router.get('/', controller.index);
router.get('/:genre_id', controller.find);
router.post('/:genre_id', secure, controller.update);
router.delete('/:genre_id', secure, controller.delete);

router.post('/:genre_id/albums/:album_id', secure, controller.addAlbum);
router.delete('/:genre_id/albums/:album_id', secure, controller.removeAlbum);

module.exports = router;

// POST /genres {new genre}
// GET /genres
// GET /genres/:genre_id
// POST /genres/:genre_id {new values}
// DELETE /genres/:genre_id

// GET /genres/:genre_id/albums
// POST /genres/:genre_id/albums/:album_id
// DELETE /genres/:genre_id/albums/:album_id
