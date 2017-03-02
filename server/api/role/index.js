'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./role.controller');

// role routes
router.post('/', secure, controller.create);
router.get('/', controller.index);
router.get('/:role_id', controller.find);
router.post('/:role_id', secure, controller.update);
router.delete('/:role_id', secure, controller.delete);


module.exports = router;
