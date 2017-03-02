'use strict';

var router = require('express').Router();
var secure = require('../../auth/auth.service').secure;

var controller = require('./person.controller');

// person routes
router.post('/', secure, controller.create);
router.get('/', controller.index);
router.get('/:person_id', controller.find);
router.post('/:person_id', secure, controller.update);
router.delete('/:person_id', secure, controller.delete);


module.exports = router;
