'use strict';

var path = require('path');

var gulp = require('gulp'),
    del = require('del'),
    runSequence = require('run-sequence');

var stylesheets = require('./build/stylesheets'),
    javascripts = require('./build/javascripts'),
    staticFiles = require('./build/static'),
    templates = require('./build/templates'),
    log = require('./utils').log;

var clean = function(config, standalone) {
  var paths = [path.join(config.publicDir, config.assetOutputPath, '/**/*')];

  if (!standalone && config.indexOutputPath) {
    paths.push(path.join(config.publicDir, config.indexOutputPath));
  }

  return del(paths);
};

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
