'use strict';

var path = require('path');

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    tinylr = require('tiny-lr'),
    through2 = require('through2');

var stylesheets = require('./build/stylesheets'),
    javascripts = require('./build/javascripts'),
    staticFiles = require('./build/static'),
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
      gulp.watch(
        config.indexOutputPath,
        function() {
          log('Refreshing index...');
          gulp.src(config.indexOutputPath).pipe(reload());
        }
      );

      gulp.watch(watchList(config.manifest.stylesheets), function() {
        stylesheets(config).pipe(reload());
      });

      gulp.watch(watchList(config.manifest.javascripts), function() {
        javascripts(config).pipe(reload());
      });

      gulp.watch(watchList(config.manifest.static), function() {
        staticFiles(config).pipe(reload());
      });

      gulp.watch(watchList(config.manifest.templates), function() {
        templates(config).pipe(reload());
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
    gulp.watch(watchList(config.manifest.stylesheets), function() {
      stylesheets(config).pipe(connect.reload());
    });

    gulp.watch(watchList(config.manifest.javascripts), function() {
      javascripts(config).pipe(connect.reload());
    });

    gulp.watch(watchList(config.manifest.static), function() {
      staticFiles(config).pipe(connect.reload());
    });

    gulp.watch(watchList(config.manifest.templates), function() {
      templates(config).pipe(connect.reload());
    });
  }
};
