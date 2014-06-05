'use strict';
var yeoman = require('yeoman-generator');

var XGenerator = yeoman.generators.Base.extend({
  init: function() {
    this.pkg = require('../package.json');

    this.on('end', function() {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function() {
    var done = this.async(),
        prompts = [{
          name: 'appName',
          message: 'What\'s the app name?'
        }];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;

      done();
    }.bind(this));
  },

  app: function() {
    this.mkdir('app');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.copy('gulpfile.js');
    this.directory('app');
    this.directory('lib');
    this.template('app/index.html');
  },

  projectfiles: function() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
  }
});

module.exports = XGenerator;
