'use strict';

var path = require('path');

module.exports = function(config) {
  var root,
      dependencies = config.environment.dependencies || {},
      locals = config.environment.locals || {},
      metaTags = {};

  for (var key in locals) {
    var match = locals[key].match(/env:\/\/(.*)/);

    if (match && match[1].length > 0) {
      metaTags['environment.' + key] = process.env[match[1]];
    }
    else {
      metaTags['environment.' + key] = locals[key];
    }
  }

  if (config.remote) {
    root = config.environment.root;
  }
  else {
    var localhost = '//' + config.devHost + ':' + config.devPort;

    root = localhost;
  }

  root += path.join('/', config.assetOutputPath, '/');

  var stylesheetUrls = [],
      javascriptUrls = [];

  stylesheetUrls.push.apply(stylesheetUrls, dependencies.stylesheets || []);
  stylesheetUrls.push(root + config.assetBasename + '.css');

  javascriptUrls.push.apply(javascriptUrls, dependencies.javascripts || []);
  javascriptUrls.push(root + config.assetBasename + '.js');

  if (config.concatenateTemplates) {
    javascriptUrls.push(root + config.assetBasename + '.templates.js');

    if (!config.angularModule) {
      console.log('config.angularModule is required when using concatenateTemplates');
      process.exit();
    }
  }

  var locals = {
    stylesheetUrls: stylesheetUrls,
    javascriptUrls: javascriptUrls,
    metaTags: metaTags
  };

  return locals;
};
