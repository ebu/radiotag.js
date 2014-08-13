/*global require, module*/
'use strict';

var URI = require('URIjs');

module.exports = {
  getUri: function(domain, http) {
    return new URI({
      protocol: http ? 'http' : 'https',
      hostname: domain,
      path: '/'
    });
  },

  getDomain: function(uri) {
    if (typeof uri === 'string') {
      uri = new URI(uri);
    }

    var domain = uri.hostname();
    var port = uri.port();

    if (port) {
      domain += ':' + port;
    }

    return domain;
  }
};
