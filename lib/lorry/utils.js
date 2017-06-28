'use strict';

var path = require('path');

var colors = require('colors/safe'),
    dedupe = require('gulp-dedupe'),
    gulp = require('gulp'),
    streamqueue = require('streamqueue');

var colorFunction = colors[process.env.LORRY_LOG_STYLE || 'rainbow'];

exports.log = function(message) {
  console.log(colors.white('[') + colorFunction('LORRY') + colors.white(']'), message);
};

exports.queueStreams = function(sources) {
  var source,
      file,
      stream,
      streams = streamqueue({ objectMode: true });

  for (var i = 0; i < sources.length; i++) {
    source = sources[i];

    for (var j = 0; j < source.files.length; j++) {
      file = source.files[j];

      stream = gulp.src(file, { base: source.base });
      streams.queue(stream);
    }
  }

  return streams.done().pipe(dedupe());
};

exports.watchList = function(sources) {
  if (sources.length === 0) return [];

  var list = sources.map(function(source) {
    return source.files;
  });

  return list;
};
