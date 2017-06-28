'use strict';

var path = require('path');

var gulp = require('gulp'),
    tinylr = require('tiny-lr'),
    through2 = require('through2');

var stylesheets = require('./build/stylesheets'),
    javascripts = require('./build/javascripts'),
    assets = require('./build/assets'),
    templates = require('./build/templates'),
    log = require('./utils').log,
    watchList = require('./utils').watchList;

var reload = function() {
  return through2.obj(function(file, enc, callback) {
    tinylr.changed(file.path);
    callback(null, file);
  });
};

module.exports = function(config, standalone) {
  log('Watching for changes...');

  if (standalone) {
    return function(liveReload) {
      gulp.watch(watchList(config.manifest.stylesheets, true), function() {
        stylesheets(config, true).pipe(reload());
      });

      gulp.watch(watchList(config.manifest.javascripts), function() {
        javascripts(config, true).pipe(reload());
      });

      gulp.watch(watchList(config.manifest.assets), function() {
        assets(config, true).pipe(reload());
      });

      gulp.watch(watchList(config.manifest.templates), function() {
        templates(config, true).pipe(reload());
      });

      if (liveReload) {
        var lr = tinylr();
        lr.listen(35729);
        log('LiveReload started on port 35729');

        process.on('SIGINT', function() {
          lr.close();
          process.exit();
        });
      }
    }
  }
  else {
    gulp.watch(watchList(config.manifest.stylesheets, true), ['stylesheets']);
    gulp.watch(watchList(config.manifest.javascripts), ['javascripts']);
    gulp.watch(watchList(config.manifest.assets), ['assets']);
    gulp.watch(watchList(config.manifest.templates), ['templates']);
  }
};
