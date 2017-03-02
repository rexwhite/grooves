'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./contribution.controller');

// contribution routes
router.post('/', secure, controller.create);
router.delete('/:contrib_id', secure, controller.delete);


module.exports = router;
