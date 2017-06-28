'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence');

var clean = require('./clean'),
    connect = require('gulp-connect'),
    stylesheets = require('./build/stylesheets'),
    javascripts = require('./build/javascripts'),
    static = require('./build/static'),
    templates = require('./build/templates'),
    log = require('./utils').log;

module.exports = function(config, standalone) {
  log('Building');

  if (standalone) {
    return function() {
      clean(config, true).then(function() {
        stylesheets(config);
        javascripts(config);
        static(config);
        templates(config);
      });
    }
  }
  else {
    gulp.task(
      'clean',
      function() {
        return clean(config);
      }
   );

    gulp.task('build', ['clean'], function() {
      stylesheets(config);
      javascripts(config);
      static(config);
      templates(config);
    });
  }
};
