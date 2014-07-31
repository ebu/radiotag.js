/*global define*/
define(['URIjs/URI'], function(URI) {
  'use strict';

  return {
    getUri: function(domain, http) {
      var proto = (http)? 'http://' : 'https://';
      return new URI(proto + domain);
    },

    getDomain: function(uri) {
      return uri._parts.hostname + ':' + uri._parts.port;
    }
  };
});
