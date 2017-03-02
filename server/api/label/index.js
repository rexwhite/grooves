'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./label.controller');

// label routes
router.get('/', controller.index);
router.get('/:label_id', controller.find);
router.post('/', secure, controller.create);
router.delete('/:label_id', secure, controller.delete);
router.post('/:label_id', secure, controller.update);

module.exports = router;
