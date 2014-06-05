'use strict';
var path = require('path');

module.exports = {
  listen: function(callback) {
    var express = require('express'),
        app = express();

    app.use(require('connect-livereload')());
    app.use(express.static(path.join(__dirname, '..', 'app')));
    app.use(express.static(path.join(__dirname, '..', 'tmp')));

    app.listen(process.env.PORT || 3000, callback);
  }
};
