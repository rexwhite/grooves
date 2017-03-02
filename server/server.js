'use strict';

var config = require('./config');

var app = require('express')();
var server = require('http').createServer(app);

var knex = require('./config/db')();

// run db migrations
knex.then(function (db) {
  return db.migrate.latest()

  // seed database
  .then(function () {
    if ('dev' === config.env) {
      return db.seed.run();
    }
  });
})

// start our app
.then(function () {
  require('./config/express')(app);
  require('./config/routes')(app);

  // start server
  server.listen(config.port, config.ip, function () {
    console.log('Express is up and listening on port %d.', config.port);
  });
});


// TO DO list
// TODO: album art
// TODO: pagination for albums
// TODO: add generic "Tags" table & relations to album (& track, people?) e.g. colored vinyl, Want, etc
// TODO: /api/people endpoints
// TODO: write a test
// TODO: gruntfile test target
// TODO: write the rest of the tests
// TODO: don't allow empty string for new artist
