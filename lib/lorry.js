'use strict';

var path = require('path');

var extend = require('extend'),
    gulp = require('gulp'),
    minimist = require('minimist');

var build = require('./lorry/build'),
    watch = require('./lorry/watch'),
    locals = require('./lorry/build/locals'),
    log = require('./lorry/utils').log;

var options = minimist(process.argv.slice(2), {});

module.exports = function(environment, projectConfig) {
  var config = {
    publicDir: 'public',
    indexOutputPath: 'index.html',
    assetOutputPath: 'assets',
    setStrictMode: true,
    concatenateTemplates: false,
    devHost: 'localhost',
    devPort: 9001,
    livereload: true
  };

  extend(true, config, projectConfig || {});

  try {
    config._package = config._package || require(path.join(process.cwd(), './package.json'));
    config.manifest = config.manifest || require(path.join(process.cwd(), './manifest.json'));
  }
  catch(e) {
    console.log(e);
    process.exit();
  }

  environment = process.env.NODE_ENV || environment;

  try {
    config.environment = require(path.join(process.cwd(), 'environments', environment + '.js'));
  }
  catch(e) {
    console.log('Unable to load environment config for ' + environment);
    process.exit();
  }

  log('Using ' + environment + ' environment');

  config.devHost = options.host || options.h || config.devHost;
  config.devPort = options.port || options.p || config.devPort;

  var remote;

  if (
    options.remote ||
    process.argv.indexOf('deploy') > 0 ||
    (process.env.NODE_ENV && process.env.NODE_ENV !== 'development')
 ) {
    config.remote = true;
  }
  else {
    config.remote = false;
  }

  config.assetBasename = config._package.name + '-' + config._package.version;

  if (config.remote) {
    config.compact = !!config.environment.compact;
    config.secure = config.environment.secure;
  }
  else {
    config.compact = config.secure = false;
  }

  return {
    installTask: function(taskName) {
      try {
        require('./lorry/' + taskName)(config, false, environment);
      }
      catch(e) {
        console.log(e);
      }
    },

    config: config,
    locals: locals(config),
    build: build(config, true),
    watch: watch(config, true)
  }
};
