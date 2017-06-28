'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence');

var clean = require('./clean'),
    stylesheets = require('./build/stylesheets'),
    javascripts = require('./build/javascripts'),
    staticFiles = require('./build/static'),
    templates = require('./build/templates'),
    log = require('./utils').log;

module.exports = function(config, standalone) {
  if (standalone) {
    return function() {
      clean(config, true).then(function() {
        log('Building');

        stylesheets(config);
        javascripts(config);
        staticFiles(config);
        templates(config);
      });
    }
  }
  else {
    gulp.task('build', function() {
      clean(config).then(function() {
        log('Building');

        stylesheets(config);
        javascripts(config);
        staticFiles(config);
        templates(config);
      });
    });
  }
};
