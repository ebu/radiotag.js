/*global require, module*/
'use strict';

var ajax = require('./http-request'),
    URI  = require('URIjs');

/**
 * Wrapper to simplify asynchronous HTTP calls.
 */

module.exports = {
  postJSON: function(url, data, accessToken) {
    var params = {
      method: 'POST',
      url: url,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (accessToken) {
      params.headers.Authorization = 'Bearer ' + accessToken;
    }

    return ajax(params);
  },

  postForm: function(url, data, accessToken) {
    var params = {
      method: 'POST',
      url: url,
      body: URI.buildQuery(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    if (accessToken) {
      params.headers.Authorization = 'Bearer ' + accessToken;
    }

    return ajax(params);
  },

  get: function(url, accessToken) {
    var params = {
      method: 'GET',
      url: url,
      headers: {}
    };

    if (accessToken) {
      params.headers.Authorization = 'Bearer ' + accessToken;
    }

    return ajax(params);
  }
};
