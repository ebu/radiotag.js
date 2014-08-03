/*global define*/
define(['URIjs/URI'], function(URI) {
  'use strict';
  return {
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
});
