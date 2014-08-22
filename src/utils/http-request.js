/*global require, module*/
'use strict';

var request = require('request'),
    Promise = require('es6-promise').Promise;

function isErrorStatusCode(statusCode) {
  return statusCode === 0 || (statusCode >= 400 && statusCode < 600);
}

/*
  Accepts a hash of parameters, performs an
  HTTP-request.
  Returns a promise that resolves with a
  normalised response object containing:
    - statusCode,
    - headers
    - body
    - error
*/
module.exports = function (params) {
  return new Promise(function (resolve, reject) {
    var normalised = {
      headers: null,
      body: null,
      error: null,
      statusCode: null
    };

    request(params, function (error, response, responseBody) {
      if (error) {
        normalised.error = error;
      }

      if (response.headers) {
        normalised.headers = response.headers;
      }

      if (responseBody) {
        normalised.body = responseBody;
      }

      if (response.statusCode) {
        normalised.statusCode = response.statusCode;
      }

      if (error || isErrorStatusCode(response.statusCode)) {
        reject(normalised);
      } else {
        resolve(normalised);
      }
    });
  });
};
