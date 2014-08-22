/*global require, module*/
'use strict';

var ajax = require('./http-request');

/**
 * Wrapper to simplify Http Asynchronous calls.
 */

module.exports = {
  postJSON: function(url, body, accessToken) {
    var params = {
      method: 'POST',
      url: url,
      body: JSON.stringify(body),
      headers: {
        'Content-Type' : 'application/json'
      }
    };

    if (accessToken) {
      params.headers.Authorization = 'Bearer ' + accessToken;
    }

    return ajax(params);
  },

  postForm: function(url, uriEncodedBody, accessToken) {
    var params = {
      method: 'POST',
      url: url,
      body: uriEncodedBody,
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
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
