'use strict';

var knex = require('knex');
var bookshelf = require('bookshelf');

var config = require('./');

var db_name = config.db_info.connection.database;
delete config.db_info.connection.database;

module.exports = function () {
  var deferred = knex.Promise.defer();

  knex(config.db_info).raw('CREATE DATABASE IF NOT EXISTS ' + db_name)
  .then(function () {
    config.db_info.connection['database'] = db_name;
    // config.db_info.connection['debug'] = true;
    var _db = knex(config.db_info);
    Object.assign(module.exports, _db);
    module.exports.bookshelf = bookshelf(_db);
    return deferred.resolve(_db);
  });

  return deferred.promise;
};
