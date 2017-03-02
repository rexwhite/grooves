'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./lot.controller');

// lot routes
router.get('/', controller.list);
router.get('/:lot_id', controller.fetch);
router.post('/', secure, controller.create);
router.delete('/:lot_id', secure, controller.delete);
router.post('/:lot_id', secure, controller.update);

module.exports = router;
