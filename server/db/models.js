'use strict';

var _ = require('lodash');
var db = require('../config/db');
var bookshelf = db.bookshelf;


//--------------------------------------------------------------------------------------------
//                                     helper functions
//--------------------------------------------------------------------------------------------

function clean (item, list) {
  if (typeof item !== 'object')
    return null;

  if (item.constructor === Array) {
    return _.map(item, function (value) {return _.pick(value, list)});
  }

  else {
    return _.pick(item, list);
  }
}



//--------------------------------------------------------------------------------------------
//                                       Album model
//--------------------------------------------------------------------------------------------

var Album = bookshelf.Model.extend({
  tableName: 'albums',
  hasTimestamps: true,

  label: function () {
    return this.belongsTo(Label);
  },
  artists: function () {
    return this.belongsToMany(Artist, 'albums_artists', 'album_id', 'artist_id');
  },
  genres: function () {
    return this.belongsToMany(Genre, 'albums_genres', 'album_id', 'genre_id');
  },
  tracks: function () {
    return this.hasMany(Track, 'album_id');
  },
  contributors: function () {
    return this.hasMany(Contribution);
  },
  lot: function () {
    return this.belongsTo(Lot);
  },
  serialize: function (options) {
    var results = bookshelf.Model.prototype.serialize.apply(this, options);
    results = _.omit(results, ['label_id', 'lot_id']);
    return results;
  }
});


Album.sanitize = function (album) {
  return clean(album, [
    'id', 'title', 'album_condition', 'album_condition', 'sleeve_condition', 'audio_quality',
    'rating', 'channels', 'discs', 'last', 'rpm', 'grams', 'size', 'discogs_url', 'label_id',
    'edition_number', 'catalog_number', 'release_date', 'notes', 'lot_id', 'label_date', 'UPC'
  ]);
};

var Albums = bookshelf.Collection.extend({
  model: Album
});


var Contribution = bookshelf.Model.extend({
  tableName: 'albums_people',
  person: function () {
    return this.belongsTo(Person);
  },
  role: function () {
    return this.belongsTo(Role);
  },
  album: function () {
    return this.belongsTo(Album);
  },
  serialize: function () {
    return {
      id: this.id,
      name: this.related('person').attributes.name,
      role: this.related('role').attributes.role,
      album: this.related('album').attributes.title
    };
  }
});

Contribution.sanitize = function (contribution) {
  return clean(contribution, ['album_id', 'person_id', 'role_id']);
};


exports.Album = Album;
exports.Albums = Albums;

exports.Contribution = Contribution;



//--------------------------------------------------------------------------------------------
//                                       Label model
//--------------------------------------------------------------------------------------------

var Label = bookshelf.Model.extend({
  tableName: 'labels'
});

Label.sanitize = function (label) {
  return clean(label, ['id', 'label']);
};


exports.Label = Label;



//--------------------------------------------------------------------------------------------
//                                      Artist model
//--------------------------------------------------------------------------------------------

var Artist = bookshelf.Model.extend({
  tableName: 'artists',
  albums: function () {
    return this.belongsToMany(Album);
  },
  serialize: function (options) {
    var results = bookshelf.Model.prototype.serialize.apply(this, options);
    results = _.omitBy(results, function (val, key) {return /_pivot_.*_id/.test(key)});
    return results;
  }
});

Artist.sanitize = function (artist) {
  return clean(artist, ['id', 'name']);
};

var Artists = bookshelf.Collection.extend({
  model: Artist
});


exports.Artist = Artist;
exports.Artists = Artists;



//--------------------------------------------------------------------------------------------
//                                       Track model
//--------------------------------------------------------------------------------------------

var Track = bookshelf.Model.extend({
  tableName: 'tracks',
  album: function () {
    return this.belongsTo(Album, 'album_id');
  }
});

Track.sanitize = function (track) {
  return clean(track, ['id', 'position', 'label', 'title', 'duration']);
};


var Tracks = bookshelf.Collection.extend({
  model: Track
});


exports.Track = Track;
exports.Tracks = Tracks;



//--------------------------------------------------------------------------------------------
//                                       Genre model
//--------------------------------------------------------------------------------------------

var Genre = bookshelf.Model.extend({
  tableName: 'genres',
  albums: function () {
    return this.belongsToMany(Album, 'albums_genres', 'genre_id', 'album_id');
  },
  serialize: function (options) {
    var results = bookshelf.Model.prototype.serialize.apply(this, options);
    results = _.omitBy(results, function (val, key) {return /_pivot_.*_id/.test(key)});
    return results;
  }
});

Genre.sanitize = function (genre) {
  return clean(genre, ['id', 'name']);
};

var Genres = bookshelf.Collection.extend({
  model: Genre
});


exports.Genre = Genre;
exports.Genres = Genres;



//--------------------------------------------------------------------------------------------
//                                       Role model
//--------------------------------------------------------------------------------------------

var Role = bookshelf.Model.extend({
  tableName: 'roles',
  assignments: function () {
    return this.hasMany(Contribution);
  }
});

Role.sanitize = function (role) {
  return clean(role, ['id', 'role']);
};

var Roles = bookshelf.Collection.extend({
  model: Role
});

exports.Role = Role;
exports.Roles = Roles;



//--------------------------------------------------------------------------------------------
//                                      Person model
//--------------------------------------------------------------------------------------------

var Person = bookshelf.Model.extend({
  tableName: 'people',
  contributions: function () {
    return this.hasMany(Contribution);
  }
});

Person.sanitize = function (person) {
  return clean(person, ['id', 'name']);
};

var People = bookshelf.Collection.extend({
  model: Person
});

exports.Person = Person;
exports.People = People;



//--------------------------------------------------------------------------------------------
//                                       Lot model
//
//  Lots are intended to represent the source of an album.  For instance, if several records
//  were purchased from a store on a particular date they would all be part of the same "Lot"
//--------------------------------------------------------------------------------------------

var Lot = bookshelf.Model.extend({
  tableName: 'lots',
  // albums: function () {
  //   return this.hasMany(Album);
  // }
});

Lot.sanitize = function (lot) {
  return clean(lot, ['id', 'lot', 'description']);
};

exports.Lot = Lot;


//--------------------------------------------------------------------------------------------
//                                       User model
//--------------------------------------------------------------------------------------------

var User = bookshelf.Model.extend({
  tableName: 'users',
  idAttribute: 'user_id',
  permissions: function () {
    return this.hasMany(Permission, 'user_id');
  }
});

User.sanitize = function (user) {
  return clean(user, ['user_id', 'username', 'password', 'name']);
};


var Users = bookshelf.Collection.extend({
  model: User
});


exports.User = User;
exports.Users = Users;



var Permission = bookshelf.Model.extend({
  tableName: 'permissions',
  user: function () {
    return this.belongsTo(User, 'user_id');
  }
});

Permission.sanitize = function (permission) {
  return clean(permission, ['user_id', 'permission']);
};


var Permissions = bookshelf.Collection.extend({
  model: Permission
});


exports.Permission = Permission;
exports.Permissions = Permissions;
