/*global require, module*/
'use strict';

var ajax = require('jquery').ajax,
    Promise = require('es6-promise').Promise;

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function buildHeaderObject(str) {
  var headerMatcher = /([a-z0-9-]*):(.*)/i;
  return str.split('\n')
            .reduce(
              function (previous, item) {
                var parts = item.match(headerMatcher),
                    name,
                    content;

                if (parts && parts[1] && parts[2]) {
                  name    = trim(parts[1]).toLowerCase();
                  content = trim(parts[2]);
                  previous[name] = content;
                }

                return previous;
              },
              {}
            );
}

/*
  Accepts a hash of parameters, performs an
  HTTP-request using jQuery.
  Returns a promise that resolves with a
  normalised response object containing, status code,
  headers, body and error.
*/
module.exports = function (params) {
  return new Promise(function (resolve, reject) {

    var normalised = {
      headers: null,
      body: null,
      error: null,
      statusCode: null
    };

    // Adapt params to jQuery style
    params.type = params.method;
    delete params.method;

    params.data = params.body;
    delete params.body;

    ajax(params)
      .then(
        function (data, textStatus, jqXHR ) {
          normalised.headers = buildHeaderObject( jqXHR.getAllResponseHeaders() );
          normalised.body = data;
          normalised.statusCode = jqXHR.statusCode();

          resolve(normalised);
        },
        function (jqXHR, textStatus, errorThrown) {
          normalised.headers = buildHeaderObject( jqXHR.getAllResponseHeaders() );
          normalised.error = errorThrown;
          normalised.statusCode = jqXHR.status;

          reject(normalised);
        }
      );
  });
};

