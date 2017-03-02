'use strict';

var path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || '9000',
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '0.0.0.0',

  // database stuff
  db_info: {
    client: 'mysql',
    connection: {
      host: process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
      port: process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
      user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'db-user',
      password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'binky',
      database: 'grooves'
    }
  },

// Root path
  root: path.normalize(__dirname + '/../..')
};
