/*global require, module*/
'use strict';

var ajax = require('./http-request');
  
/**
 * Wrapper to simplify Http Asynchronous calls.
 */

module.exports = {
  postJSON: function(url, body, accessToken) {
    return ajax({
      type: 'POST',
      url: url,
      data: JSON.stringify(body),
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
  },

  postForm: function(url, uriEncodedBody, accessToken) {
    return ajax({
      type: 'POST',
      url: url,
      contentType: 'application/x-www-form-urlencoded',
      data: uriEncodedBody,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
  },

  get: function(url, accessToken) {
    return ajax({
      type: 'GET',
      url: url,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
  }
};
