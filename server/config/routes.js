'use strict';

var express = require('express');
var path = require('path');
var config = require('./');

var one_month = 1000 * 60 * 60 * 24 * 30; // a month of milli-seconds

if (config.env !== 'production') one_month = 0;

module.exports = function (app) {
  var root = config.root;




  var upload = require('multer')({dest: './uploads/'}).single('image');

  app.post('/api/images',
    upload(req, res),
    function (err, req, res) {
      if (err) {
        return res.status(500).end();
      }

      console.log('/api/images -> req.body:');
      console.dir(req.body);
      console.log('/api/images -> req.file:');
      console.dir(req.file);

      res.status(204).end();
    }
  );




  // Set up the default static routes for index.html, resources, bower_components, etc here.
  app.use(express.static(path.join(root, 'client'), {maxAge: one_month}));

  // API routes
  app.use('/auth', require('../auth')(app));
  app.use('/api/artists', require('../api/artist'));
  app.use('/api/labels', require('../api/label'));
  app.use('/api/albums', require('../api/album'));
  app.use('/api/users', require('../api/user'));
  app.use('/api/genres', require('../api/genre'));
  app.use('/api/people', require('../api/person'));
  app.use('/api/roles', require('../api/role'));
  app.use('/api/contributions', require('../api/contribution'));
  app.use('/api/lots', require('../api/lot'));

  // If we're looking for an asset that didn't exist, return a 404
  app.all('/:url(api|app|assets|bower_component)/*', function (req, res) {
    return res.status(404).json({message: 'Could not find: ' + req.url});
  });

  // If we get this far then no other routes matched so ust return index.html...
  app.get('/*', function (req, res) {
    res.sendFile(path.join(root, 'client/index.html'), {maxAge: one_month});
  });
};
