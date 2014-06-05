/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('x generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('x:app', [
        '../../app'
      ]);
      this.app.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.jshintrc',
      '.bowerrc',
      'bower.json',
      'package.json',
      'app/index.html',
      'lib/server.js',
      'gulpfile.js'
    ];

    helpers.mockPrompt(this.app, {
      'appName': 'test'
    });
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
