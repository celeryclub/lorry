'use strict';

var path = require('path');

var gulp = require('gulp'),
    s3 = require('gulp-s3'),
    streamqueue = require('streamqueue');

var log = require('./utils').log;

var s3Options = function(index) {
  return {
    headers: {
      'Cache-Control': (index ? 'no-cache' : 'public, no-transform, max-age=31536000')
    }
  };
};

module.exports = function(config, standalone) {
  gulp.task(
    'deploy',
    ['build'],
    function() {
      var bucket;

      try {
        bucket = config.environment.deploy.bucket;
      }
      catch(e) {
        console.log('The specified environment does not have a deploy configuration');
        process.exit();
      }

      log('Deploying to bucket "' + bucket + '"');

      var s3Configuration = {
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: bucket,
        region: config.environment.deploy.region
      };

      var indexSource = config.indexOutputPath ? path.join(config.publicDir, config.indexOutputPath) : '',
          otherSources = [path.join(config.publicDir, '/**')];

      if (indexSource) {
        otherSources.push('!' + path.join(config.publicDir, config.indexOutputPath));
      }

      return streamqueue(
        { objectMode: true },
        gulp.
          src(indexSource).
          pipe(s3(s3Configuration, s3Options(true))),
        gulp.
          src(otherSources).
          pipe(s3(s3Configuration, s3Options()))
     );
    }
 );
};
