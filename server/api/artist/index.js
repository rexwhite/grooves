'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./artist.controller');

// artist routes
router.get('/', controller.index);
router.get('/:artist_id', controller.find);
router.post('/', secure, controller.create);
router.delete('/:artist_id', secure, controller.delete);
router.post('/:artist_id', secure, controller.update);

router.post('/:artist_id/album/:album_id', controller.addToAlbum);
router.delete('/:artist_id/album/:album_id', controller.removeFromAlbum);

module.exports = router;
